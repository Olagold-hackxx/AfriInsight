"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Database, AlertCircle, CheckCircle, X, Brain, Coins, Zap, Trophy } from 'lucide-react'
import { useDropzone } from "react-dropzone"
import useIPFS from '@/hooks/useIPFS'
import useUploadContent from '../../hooks/DeHug/useUploadContent'
import { useActiveAccount } from "thirdweb/react"

// Static NFT image
const STATIC_NFT_IMAGE = "https://aqua-charming-crow-34.mypinata.cloud/ipfs/bafkreicspnlkp5r5sx4spzlvys6lbj4oiauwl4n22o7hncajtpcvuw6yfe"
const STATIC_IMAGE_HASH = "bafkreicspnlkp5r5sx4spzlvys6lbj4oiauwl4n22o7hncajtpcvuw6yfe"

const modelCategories = [
  "Natural Language Processing",
  "Computer Vision", 
  "Audio",
  "Multimodal",
  "Reinforcement Learning",
  "Time Series",
  "Tabular"
]

const datasetCategories = [
  "Natural Language Processing",
  "Computer Vision",
  "Audio", 
  "Multimodal",
  "Tabular",
  "Time Series",
  "Scientific"
]

const licenses = [
  { value: "apache-2.0", label: "Apache 2.0" },
  { value: "mit", label: "MIT" },
  { value: "cc-by-4.0", label: "CC BY 4.0" },
  { value: "cc-by-sa-4.0", label: "CC BY-SA 4.0" },
  { value: "gpl-3.0", label: "GPL 3.0" },
  { value: "custom", label: "Custom License" }
]

// NFT Metadata interface
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    contentType: 'MODEL' | 'DATASET';
    ipfsHash: string;
    downloadCount: number;
    uploadTimestamp: number;
    tags: string[];
    uploader: string;
    category?: string;
    license?: string;
    author?: string;
    homepage?: string;
    repository?: string;
  };
}

interface UploadContentParams {
  contentType: 0 | 1; // 0 for DATASET, 1 for MODEL
  ipfsHash: string;
  metadataIPFSHash: string;
  imageIPFSHash: string;
  title: string;
  tags: string[];
}

// Upload preparation result
interface UploadPreparationResult {
  mainFileHash: string;
  mainFileUrl: string;
  metadataHash: string;
  metadataUrl: string;
  params: UploadContentParams;
}

interface UploadResult {
  tokenId: string;
  mainFileHash: string;
  mainFileUrl: string;
  metadataHash: string;
  metadataUrl: string;
  ipfsUrls: {
    mainFile: string;
    metadata: string;
    image: string;
  };
}

interface UploadProgressState {
  stage: 'idle' | 'uploading-files' | 'creating-metadata' | 'uploading-metadata' | 'minting-nft' | 'complete';
  progress: number;
  message: string;
}

function createNFTMetadata(
  title: string,
  description: string,
  contentType: 'MODEL' | 'DATASET',
  ipfsHash: string,
  tags: string[],
  uploader: string,
  additionalData?: {
    category?: string;
    license?: string;
    author?: string;
    homepage?: string;
    repository?: string;
  }
): NFTMetadata {
  return {
    name: title,
    description: description,
    image: STATIC_NFT_IMAGE,
    external_url: `https://your-dehug-app.vercel.app/content/${ipfsHash}`,
    attributes: [
      { trait_type: "Content Type", value: contentType },
      { trait_type: "Points Balance", value: 0 },
      { trait_type: "Downloads", value: 0 }, 
      { trait_type: "Quality Tier", value: "BASIC" },
      { trait_type: "Upload Date", value: new Date().toISOString().split('T')[0] },
      { trait_type: "Tags", value: tags.join(', ') },
      { trait_type: "Uploader", value: uploader.slice(0, 10) + '...' },
      ...(additionalData?.category ? [{ trait_type: "Category", value: additionalData.category }] : []),
      ...(additionalData?.license ? [{ trait_type: "License", value: additionalData.license }] : []),
      ...(additionalData?.author ? [{ trait_type: "Author", value: additionalData.author }] : []),
    ],
    properties: {
      contentType,
      ipfsHash,
      downloadCount: 0,
      uploadTimestamp: Date.now(),
      tags,
      uploader,
      ...additionalData
    }
  };
}

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<"model" | "dataset">("model")
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgressState, setUploadProgressState] = useState<UploadProgressState>({
    stage: 'idle',
    progress: 0,
    message: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    license: "",
    customLicense: "",
    isPublic: true,
    allowCommercial: true,
    author: "",
    homepage: "",
    repository: ""
  })

  // Hooks
  const { uploadToIPFS, getIPFSHash } = useIPFS()
  const uploadContent = useUploadContent()
  const account = useActiveAccount()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: uploadType === "model" ? {
      'application/octet-stream': ['.bin', '.safetensors', '.ckpt', '.pth'],
      'application/json': ['.json'],
      'text/plain': ['.txt', '.md'],
      'application/zip': ['.zip']
    } : {
      'text/csv': ['.csv'],
      'application/json': ['.json', '.jsonl'],
      'application/parquet': ['.parquet'],
      'application/zip': ['.zip'],
      'text/plain': ['.txt']
    },
    maxSize: uploadType === "model" ? 10 * 1024 * 1024 * 1024 : 50 * 1024 * 1024 * 1024
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Upload preparation function
  const uploadContentComplete = async (
    file: File,
    title: string,
    description: string,
    contentType: 'MODEL' | 'DATASET',
    tags: string[],
    userAddress: string,
    additionalData?: {
      category?: string;
      license?: string;
      author?: string;
      homepage?: string;
      repository?: string;
    }
  ): Promise<UploadPreparationResult> => {
    try {
      // Stage 1: Upload main file to IPFS
      setUploadProgressState({
        stage: 'uploading-files',
        progress: 20,
        message: 'Uploading files to IPFS...'
      })
      console.log('Step 1: Uploading main file to IPFS...')
      const mainFileUrl = await uploadToIPFS(file)
      const mainFileHash = getIPFSHash(mainFileUrl)
      console.log(`Main file uploaded: ${mainFileHash}`)

      // Stage 2: Create NFT metadata (with description and additional data)
      setUploadProgressState({
        stage: 'creating-metadata',
        progress: 50,
        message: 'Creating NFT metadata...'
      })
      console.log('Step 2: Creating NFT metadata...')
      const nftMetadata = createNFTMetadata(
        title,
        description,
        contentType,
        mainFileHash,
        tags,
        userAddress,
        additionalData
      )

      // Stage 3: Upload metadata to IPFS
      setUploadProgressState({
        stage: 'uploading-metadata',
        progress: 70,
        message: 'Uploading metadata to IPFS...'
      })
      console.log('Step 3: Uploading metadata to IPFS...')
      const metadataUrl = await uploadToIPFS(nftMetadata)
      const metadataHash = getIPFSHash(metadataUrl)
      console.log(`Metadata uploaded: ${metadataHash}`)

      // Prepare parameters for contract call (description removed)
      const params: UploadContentParams = {
        contentType: contentType === 'MODEL' ? 1 : 0,
        ipfsHash: mainFileHash,
        metadataIPFSHash: metadataHash,
        imageIPFSHash: STATIC_IMAGE_HASH,
        title,
        tags // description removed from contract call
      }

      return {
        mainFileHash,
        mainFileUrl,
        metadataHash,
        metadataUrl,
        params
      }
    } catch (error) {
      console.error('Upload preparation failed:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgressState({
      stage: 'uploading-files',
      progress: 0,
      message: 'Starting upload...'
    })

    try {
      const userAddress = account?.address
      if (!userAddress) {
        throw new Error('Wallet not connected')
      }

      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

      // Prepare additional metadata to store in IPFS
      const additionalData = {
        category: formData.category,
        license: formData.license === 'custom' ? formData.customLicense : formData.license,
        author: formData.author,
        homepage: formData.homepage,
        repository: formData.repository
      }

      // Step 1-3: Upload to IPFS and prepare metadata
      const preparationResult = await uploadContentComplete(
        files[0],
        formData.title,
        formData.description, // Description goes to IPFS metadata, not contract
        uploadType.toUpperCase() as 'MODEL' | 'DATASET',
        tags,
        userAddress,
        additionalData
      )

      // Step 4: Mint NFT using the contract via useUploadContent hook
      setUploadProgressState({
        stage: 'minting-nft',
        progress: 90,
        message: 'Minting NFT on blockchain...'
      })
      console.log('Step 4: Minting NFT on blockchain...')
      const uploadResult = await uploadContent(preparationResult.params)

      if (!uploadResult || !uploadResult.success) {
        throw new Error('Failed to mint NFT')
      }

      setUploadProgressState({
        stage: 'complete',
        progress: 100,
        message: 'Upload complete!'
      })
      console.log(`Upload complete! Token ID: ${uploadResult.tokenId}`)

      if (!uploadResult.tokenId) {
        throw new Error('Token ID not returned from uploadContent')
      }

      setUploadResult({
        tokenId: uploadResult.tokenId,
        mainFileHash: preparationResult.mainFileHash,
        mainFileUrl: preparationResult.mainFileUrl,
        metadataHash: preparationResult.metadataHash,
        metadataUrl: preparationResult.metadataUrl,
        ipfsUrls: {
          mainFile: preparationResult.mainFileUrl,
          metadata: preparationResult.metadataUrl,
          image: STATIC_NFT_IMAGE
        }
      })
      setUploadComplete(true)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgressState({
        stage: 'idle',
        progress: 0,
        message: 'Upload failed. Please try again.'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const resetUpload = () => {
    setUploadComplete(false)
    setFiles([])
    setUploadResult(null)
    setUploadProgressState({
      stage: 'idle',
      progress: 0,
      message: ''
    })
    setFormData({
      title: "",
      description: "",
      category: "",
      tags: "",
      license: "",
      customLicense: "",
      isPublic: true,
      allowCommercial: true,
      author: "",
      homepage: "",
      repository: ""
    })
  }

  if (uploadComplete && uploadResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white flex items-center justify-center">
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-8">
            <span className="text-white">Upload</span>
            <br />
            <span className="text-slate-400 font-thin">Successful!</span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 font-light leading-relaxed">
            Your {uploadType} has been uploaded to IPFS and your NFT has been minted. 
            The value will increase as your contribution gains popularity.
          </p>
          
          {/* NFT Details */}
          <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 p-8 mb-12 text-left">
            <div className="flex items-center mb-6">
              <Coins className="h-6 w-6 text-amber-400 mr-3" />
              <h3 className="text-xl font-light text-white">Your NFT Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-slate-400 font-light">Token ID:</span>
                <p className="text-white font-mono">{uploadResult.tokenId}</p>
              </div>
              <div>
                <span className="text-slate-400 font-light">Initial Value:</span>
                <p className="text-amber-400 font-medium">0.1 ETH</p>
              </div>
              <div>
                <span className="text-slate-400 font-light">Main File IPFS:</span>
                <p className="text-white font-mono text-xs">{uploadResult.mainFileHash}</p>
              </div>
              <div>
                <span className="text-slate-400 font-light">Metadata IPFS:</span>
                <p className="text-white font-mono text-xs">{uploadResult.metadataHash}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
              <span className="text-slate-400 font-light">IPFS URLs:</span>
              <div className="mt-2 space-y-2">
                <a 
                  href={uploadResult.ipfsUrls.mainFile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 text-xs font-mono"
                >
                  📄 Main File: {uploadResult.ipfsUrls.mainFile}
                </a>
                <a 
                  href={uploadResult.ipfsUrls.metadata} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 text-xs font-mono"
                >
                  📋 Metadata: {uploadResult.ipfsUrls.metadata}
                </a>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={() => window.location.href = uploadType === 'model' ? '/models' : '/datasets'}
              className="bg-white text-black hover:bg-slate-100 px-12 py-4 text-lg font-medium"
            >
              Browse {uploadType === 'model' ? 'Models' : 'Datasets'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={resetUpload}
              className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 px-12 py-4 text-lg font-light"
            >
              Upload Another {uploadType === 'model' ? 'Model' : 'Dataset'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <Badge 
              variant="outline" 
              className="mb-6 border-slate-600 text-slate-300 px-4 py-2 backdrop-blur-sm bg-slate-900/50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload & Earn NFT Rewards
            </Badge>
            <h1 className="text-5xl md:text-7xl font-light mb-6 leading-none">
              <span className="text-white">
                Share Your
              </span>
              <br />
              <span className="text-slate-400 font-thin">
                AI Assets
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              Upload models or datasets to the decentralized network and receive NFTs that appreciate 
              in value based on community engagement and usage.
            </p>
          </div>

          {/* Upload Type Selection */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4 p-2 bg-slate-900/30 backdrop-blur-sm border border-slate-800">
                <Button
                  variant={uploadType === "model" ? "default" : "outline"}
                  onClick={() => setUploadType("model")}
                  className={`px-8 py-4 text-lg font-light ${
                    uploadType === "model"
                      ? 'bg-white text-black hover:bg-slate-100'
                      : 'bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Brain className="h-5 w-5 mr-3" />
                  AI Model
                </Button>
                <Button
                  variant={uploadType === "dataset" ? "default" : "outline"}
                  onClick={() => setUploadType("dataset")}
                  className={`px-8 py-4 text-lg font-light ${
                    uploadType === "dataset"
                      ? 'bg-white text-black hover:bg-slate-100'
                      : 'bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Database className="h-5 w-5 mr-3" />
                  Dataset
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* File Upload */}
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white font-light text-2xl">
                  <Upload className="h-6 w-6 mr-3" />
                  Upload {uploadType === 'model' ? 'Model' : 'Dataset'} Files
                </CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  {uploadType === 'model' 
                    ? 'Upload model files (.bin, .safetensors, .pth, .ckpt), config files, and documentation.'
                    : 'Upload dataset files (.csv, .json, .parquet, .zip) with optional documentation.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-slate-500 bg-slate-800/30' 
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/10'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  {isDragActive ? (
                    <p className="text-slate-300 text-xl font-light">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-slate-300 mb-3 text-xl font-light">
                        Drag and drop your files here, or click to select files
                      </p>
                      <p className="text-sm text-slate-500 font-light">
                        {uploadType === 'model' 
                          ? 'Supported: .bin, .safetensors, .pth, .ckpt, .json, .txt, .md, .zip (Max: 10GB)'
                          : 'Supported: .csv, .json, .jsonl, .parquet, .zip, .txt (Max: 50GB)'
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-8 space-y-3">
                    <h4 className="font-light text-white text-lg">Selected Files:</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-700">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-slate-400 mr-4" />
                          <div>
                            <span className="text-sm font-light text-white">{file.name}</span>
                            <span className="text-xs text-slate-400 ml-3">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-2xl">
                  {uploadType === 'model' ? 'Model' : 'Dataset'} Information
                </CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Provide details to help others discover and understand your {uploadType}. 
                  <span className="text-amber-400"> Description and metadata are stored on IPFS for richer content.</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-white font-light">Title *</Label>
                    <Input
                      id="title"
                      placeholder={uploadType === 'model' ? 'e.g., GPT-2 Fine-tuned for Poetry' : 'e.g., Common Crawl Web Text'}
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-white font-light">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-slate-800/20 border-slate-700 text-white h-12">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        {(uploadType === 'model' ? modelCategories : datasetCategories).map(category => (
                          <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')} className="focus:bg-slate-800">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-white font-light">
                    Description * 
                    <span className="text-amber-400 text-sm ml-2">(Stored on IPFS)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={`Describe your ${uploadType}, its capabilities, training details, and potential use cases...`}
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="tags" className="text-white font-light">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="pytorch, nlp, text-generation (comma-separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 h-12"
                    />
                    <p className="text-xs text-slate-500 font-light">
                      Add relevant tags to help others discover your {uploadType}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="author" className="text-white font-light">Author/Organization</Label>
                    <Input
                      id="author"
                      placeholder="e.g., OpenAI, Google Research, etc."
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="homepage" className="text-white font-light">Homepage (Optional)</Label>
                    <Input
                      id="homepage"
                      placeholder="https://example.com"
                      value={formData.homepage}
                      onChange={(e) => handleInputChange('homepage', e.target.value)}
                      className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="repository" className="text-white font-light">Repository (Optional)</Label>
                    <Input
                      id="repository"
                      placeholder="https://github.com/user/repo"
                      value={formData.repository}
                      onChange={(e) => handleInputChange('repository', e.target.value)}
                      className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500 h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Licensing */}
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-2xl">Licensing & Access</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Choose how others can use your {uploadType} and set access permissions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="license" className="text-white font-light">License *</Label>
                  <Select value={formData.license} onValueChange={(value) => handleInputChange('license', value)}>
                    <SelectTrigger className="bg-slate-800/20 border-slate-700 text-white h-12">
                      <SelectValue placeholder="Select a license" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      {licenses.map(license => (
                        <SelectItem key={license.value} value={license.value} className="focus:bg-slate-800">
                          {license.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.license === 'custom' && (
                  <div className="space-y-3">
                    <Label htmlFor="customLicense" className="text-white font-light">Custom License Details</Label>
                    <Textarea
                      id="customLicense"
                      placeholder="Describe your custom license terms..."
                      rows={4}
                      value={formData.customLicense}
                      onChange={(e) => handleInputChange('customLicense', e.target.value)}
                      className="bg-slate-800/20 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500"
                    />
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked as boolean)}
                      className="border-slate-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label htmlFor="isPublic" className="text-white font-light">
                      Make this {uploadType} publicly discoverable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allowCommercial"
                      checked={formData.allowCommercial}
                      onCheckedChange={(checked) => handleInputChange('allowCommercial', checked as boolean)}
                      className="border-slate-600 data-[state=checked]:bg-white data-[state=checked]:border-white"
                    />
                    <Label htmlFor="allowCommercial" className="text-white font-light">
                      Allow commercial use of this {uploadType}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Rewards Info */}
            <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border-amber-800/30">
              <CardHeader>
                <CardTitle className="flex items-center text-white font-light text-2xl">
                  <Trophy className="h-6 w-6 mr-3 text-amber-400" />
                  NFT Rewards
                </CardTitle>
                <CardDescription className="text-amber-200/80 font-light">
                  Earn rewards for your contribution to the decentralized AI ecosystem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600/20 border border-amber-600/30 flex items-center justify-center mx-auto mb-3">
                      <Coins className="h-6 w-6 text-amber-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Initial NFT</h4>
                    <p className="text-sm text-amber-200/80 font-light">
                      Receive an NFT representing ownership of your contribution
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600/20 border border-amber-600/30 flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-amber-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Value Growth</h4>
                    <p className="text-sm text-amber-200/80 font-light">
                      NFT value increases with downloads and community engagement
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600/20 border border-amber-600/30 flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6 text-amber-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Royalties</h4>
                    <p className="text-sm text-amber-200/80 font-light">
                      Earn ongoing royalties from popular contributions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {isUploading && (
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardContent className="pt-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-light text-white">{uploadProgressState.message}</span>
                      <span className="text-slate-400">{Math.round(uploadProgressState.progress)}%</span>
                    </div>
                    <Progress value={uploadProgressState.progress} className="w-full h-3" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className={`flex items-center ${
                        uploadProgressState.stage === 'uploading-files' || uploadProgressState.progress > 20 
                          ? 'text-green-400' 
                          : 'text-slate-400'
                      }`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Uploading to IPFS
                      </div>
                      <div className={`flex items-center ${
                        uploadProgressState.stage === 'creating-metadata' || uploadProgressState.progress > 50 
                          ? 'text-green-400' 
                          : 'text-slate-400'
                      }`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Creating metadata
                      </div>
                      <div className={`flex items-center ${
                        uploadProgressState.stage === 'uploading-metadata' || uploadProgressState.progress > 70 
                          ? 'text-green-400' 
                          : 'text-slate-400'
                      }`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Storing metadata
                      </div>
                      <div className={`flex items-center ${
                        uploadProgressState.stage === 'minting-nft' || uploadProgressState.progress > 90 
                          ? 'text-green-400' 
                          : 'text-slate-400'
                      }`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Minting NFT
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-800">
              <div className="flex items-center text-sm text-slate-400 font-light">
                <AlertCircle className="h-4 w-4 mr-2" />
                By uploading, you agree to our Terms of Service and receive an NFT for your contribution
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={files.length === 0 || !formData.title || !formData.description || !formData.category || !formData.license || isUploading}
                className="bg-white text-black hover:bg-slate-100 px-12 py-4 text-lg font-medium disabled:opacity-50"
              >
                {isUploading ? 'Uploading & Minting...' : `Upload ${uploadType === 'model' ? 'Model' : 'Dataset'} & Mint NFT`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}