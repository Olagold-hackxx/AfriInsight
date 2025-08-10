"""Utility functions for DeHug SDK"""

import json
import requests
import pandas as pd
import pickle
import zipfile
import io
from typing import Any, Dict, Optional, Union
from pathlib import Path
from .exceptions import NetworkError, IPFSError, DeHugError


def load_config() -> Dict[str, str]:
    """Load default configuration"""
    return {
        "ipfs_gateway": "https://ipfs.io/ipfs",
        "contract_api": "https://api.dehug.io",
        "track_api": "https://analytics.dehug.io",
        "request_timeout": 30,
    }


def download_from_ipfs(cid: str, gateway: str = "https://ipfs.io/ipfs") -> bytes:
    """Download content from IPFS using gateway"""
    url = f"{gateway.rstrip('/')}/{cid}"

    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        raise NetworkError(f"Failed to download from IPFS: {e}")


def extract_zip(content: bytes, extract_to: Optional[str] = None) -> Dict[str, bytes]:
    """
    Extract ZIP file from bytes.
    Returns a dict of {filename: file_bytes} if extract_to is None,
    otherwise extracts to the given directory.
    """
    with zipfile.ZipFile(io.BytesIO(content)) as z:
        if extract_to:
            ensure_directory(extract_to)
            z.extractall(extract_to)
            return {"_extracted_to": extract_to}
        else:
            return {name: z.read(name) for name in z.namelist()}


def load_content_from_cid(cid: str, format_hint: Optional[str] = None) -> Any:
    """Load and parse content from IPFS CID"""
    content = download_from_ipfs(cid)

    if format_hint == "json":
        try:
            return json.loads(content.decode("utf-8"))
        except json.JSONDecodeError as e:
            raise DeHugError(f"Failed to parse JSON: {e}")

    elif format_hint == "csv":
        try:
            from io import StringIO

            return pd.read_csv(StringIO(content.decode("utf-8")))
        except Exception as e:
            raise DeHugError(f"Failed to parse CSV: {e}")

    elif format_hint in ["pickle", "pkl"]:
        try:
            return pickle.loads(content)
        except Exception as e:
            raise DeHugError(f"Failed to load Pickle: {e}")

    elif format_hint == "parquet":
        try:
            return pd.read_parquet(io.BytesIO(content))
        except Exception as e:
            raise DeHugError(f"Failed to load Parquet: {e}")

    elif format_hint == "zip":
        return extract_zip(content)

    elif format_hint == "text":
        return content.decode("utf-8")

    elif format_hint == "binary":
        return content

    else:
        # Auto-detect format
        try:
            return json.loads(content.decode("utf-8"))
        except:
            try:
                from io import StringIO

                return pd.read_csv(StringIO(content.decode("utf-8")))
            except:
                try:
                    return pickle.loads(content)
                except:
                    try:
                        return pd.read_parquet(io.BytesIO(content))
                    except:
                        try:
                            return extract_zip(content)
                        except:
                            try:
                                return content.decode("utf-8")
                            except:
                                return content


def load_dataset_from_cid(
    cid: str, format_hint: Optional[str] = None
) -> Union[pd.DataFrame, Dict, str, bytes]:
    """Load dataset from IPFS CID"""
    return load_content_from_cid(cid, format_hint)


def ensure_directory(path: str) -> Path:
    """Ensure directory exists, create if not"""
    path_obj = Path(path)
    path_obj.mkdir(parents=True, exist_ok=True)
    return path_obj
