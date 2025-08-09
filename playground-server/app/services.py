"""
FastAPI backend server for AI model inference from IPFS
Supports text generation, classification, image classification, and speech recognition
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Union, List
import httpx
import json
import os
import tempfile
import zipfile
import tarfile
from pathlib import Path
import asyncio
import logging
from datetime import datetime
import hashlib
import uuid
import logger from ../logger

try:
    from transformers import (
        AutoTokenizer, AutoModelForCausalLM, AutoModelForSequenceClassification,
        AutoModelForImageClassification, AutoProcessor, pipeline
    )
    import torch
    from PIL import Image
    import librosa
    import numpy as np
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False


async def download_from_ipfs(ipfs_hash: str) -> Path:
    """Download model from IPFS and extract if needed"""
    model_dir = Path(MODEL_CACHE_DIR) / ipfs_hash
    
    if model_dir.exists():
        logger.info(f"Model {ipfs_hash} already cached")
        return model_dir
    
    logger.info(f"Downloading model {ipfs_hash} from IPFS")
    
    # Create temporary directory for download
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        download_path = temp_path / "model_download"
        
        # Try different IPFS gateways
        gateways = [
            f"{IPFS_GATEWAY}/{ipfs_hash}",
            f"https://ipfs.io/ipfs/{ipfs_hash}",
            f"https://cloudflare-ipfs.com/ipfs/{ipfs_hash}"
        ]
        
        downloaded = False
        for gateway_url in gateways:
            try:
                async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
                    response = await client.get(gateway_url)
                    
                if response.status_code == 200:
                    # Check content type to determine if it's an archive
                    content_type = response.headers.get('content-type', '')
                    
                    if 'application/zip' in content_type or gateway_url.endswith('.zip'):
                        download_path = download_path.with_suffix('.zip')
                    elif 'application/x-tar' in content_type or gateway_url.endswith('.tar.gz'):
                        download_path = download_path.with_suffix('.tar.gz')
                    
                    # Write the downloaded content
                    with open(download_path, 'wb') as f:
                        f.write(response.content)
                    
                    downloaded = True
                    logger.info(f"Successfully downloaded from {gateway_url}")
                    break
                    
            except Exception as e:
                logger.warning(f"Failed to download from {gateway_url}: {e}")
                continue
        
        if not downloaded:
            raise HTTPException(status_code=404, detail=f"Could not download model {ipfs_hash} from any IPFS gateway")
        
        # Extract if it's an archive
        model_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            if download_path.suffix == '.zip':
                with zipfile.ZipFile(download_path, 'r') as zip_ref:
                    zip_ref.extractall(model_dir)
            elif download_path.suffix in ['.tar.gz', '.tar']:
                with tarfile.open(download_path, 'r:*') as tar_ref:
                    tar_ref.extractall(model_dir)
            else:
                # Single file, copy it
                import shutil
                shutil.copy2(download_path, model_dir / "model_file")
                
        except Exception as e:
            logger.error(f"Failed to extract model {ipfs_hash}: {e}")
            # Try to use as single file
            import shutil
            shutil.copy2(download_path, model_dir / "model_file")
    
    logger.info(f"Model {ipfs_hash} cached successfully")
    return model_dir

def get_model_size(model_path: Path) -> float:
    """Calculate model size in MB"""
    total_size = 0
    for file_path in model_path.rglob('*'):
        if file_path.is_file():
            total_size += file_path.stat().st_size
    return total_size / (1024 * 1024)

async def load_model(model_hash: str, task: str) -> Dict[str, Any]:
    """Load model into memory"""
    if not HAS_TRANSFORMERS:
        raise HTTPException(
            status_code=500, 
            detail="Transformers library not installed. Please install: pip install transformers torch"
        )
    
    cache_key = f"{model_hash}_{task}"
    
    if cache_key in model_cache:
        model_cache[cache_key]['last_used'] = datetime.now()
        logger.info(f"Using cached model {cache_key}")
        return model_cache[cache_key]
    
    # Download model from IPFS
    model_path = await download_from_ipfs(model_hash)
    
    try:
        # Determine model loading strategy based on task
        if task == "text-generation":
            tokenizer = AutoTokenizer.from_pretrained(str(model_path))
            model = AutoModelForCausalLM.from_pretrained(str(model_path))
            
            # Ensure tokenizer has pad_token
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token
            
            model_obj = {
                'tokenizer': tokenizer,
                'model': model,
                'task': task,
                'loaded_at': datetime.now(),
                'last_used': datetime.now(),
                'path': str(model_path)
            }
            
        elif task == "text-classification":
            tokenizer = AutoTokenizer.from_pretrained(str(model_path))
            model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
            
            model_obj = {
                'tokenizer': tokenizer,
                'model': model,
                'task': task,
                'loaded_at': datetime.now(),
                'last_used': datetime.now(),
                'path': str(model_path)
            }
            
        elif task == "image-classification":
            processor = AutoProcessor.from_pretrained(str(model_path))
            model = AutoModelForImageClassification.from_pretrained(str(model_path))
            
            model_obj = {
                'processor': processor,
                'model': model,
                'task': task,
                'loaded_at': datetime.now(),
                'last_used': datetime.now(),
                'path': str(model_path)
            }
            
        elif task == "speech-recognition":
            # Use pipeline for speech recognition (Whisper-like models)
            pipe = pipeline("automatic-speech-recognition", model=str(model_path))
            
            model_obj = {
                'pipeline': pipe,
                'task': task,
                'loaded_at': datetime.now(),
                'last_used': datetime.now(),
                'path': str(model_path)
            }
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported task: {task}")
        
        # Cache the model
        model_cache[cache_key] = model_obj
        logger.info(f"Model {cache_key} loaded and cached successfully")
        
        return model_obj
        
    except Exception as e:
        logger.error(f"Failed to load model {model_hash} for task {task}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

async def run_text_generation(model_obj: Dict[str, Any], input_text: str, params: TextGenerationParams) -> Dict[str, Any]:
    """Run text generation inference"""
    tokenizer = model_obj['tokenizer']
    model = model_obj['model']
    
    # Tokenize input
    inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)
    
    # Generate
    with torch.no_grad():
        outputs = model.generate(
            inputs['input_ids'],
            attention_mask=inputs.get('attention_mask'),
            max_length=len(inputs['input_ids'][0]) + params.max_length,
            temperature=params.temperature,
            top_p=params.top_p,
            top_k=params.top_k,
            do_sample=params.do_sample,
            pad_token_id=tokenizer.eos_token_id
        )
    
    # Decode output
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Remove input text from output
    if generated_text.startswith(input_text):
        generated_text = generated_text[len(input_text):].strip()
    
    return {
        'generated_text': generated_text,
        'full_text': tokenizer.decode(outputs[0], skip_special_tokens=True),
        'parameters_used': params.dict()
    }

async def run_text_classification(model_obj: Dict[str, Any], input_text: str, params: TextClassificationParams) -> Dict[str, Any]:
    """Run text classification inference"""
    tokenizer = model_obj['tokenizer']
    model = model_obj['model']
    
    # Tokenize input
    inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=params.max_length)
    
    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    # Get label names if available
    if hasattr(model.config, 'id2label'):
        labels = [model.config.id2label[i] for i in range(len(predictions[0]))]
    else:
        labels = [f"LABEL_{i}" for i in range(len(predictions[0]))]
    
    # Create results
    scores = predictions[0].tolist()
    results = [{'label': label, 'score': score} for label, score in zip(labels, scores)]
    results.sort(key=lambda x: x['score'], reverse=True)
    
    if params.return_all_scores:
        return {
            'predictions': results,
            'top_prediction': results[0],
            'parameters_used': params.dict()
        }
    else:
        return {
            'label': results[0]['label'],
            'score': results[0]['score'],
            'all_scores': results,
            'parameters_used': params.dict()
        }

