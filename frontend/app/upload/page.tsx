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

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<"model" | "dataset">("model")
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [nftDetails, setNftDetails] = useState<any>(null)
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
    maxSize: uploadType === "model" ? 10 * 1024 * 1024 * 1024 : 50 * 1024 * 1024 * 1024 // 10GB for models, 50GB for datasets
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          // Simulate NFT minting
          setNftDetails({
            tokenId: "0x" + Math.random().toString(16).substr(2, 8),
            initialValue: "0.1 ETH",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            ipfsHash: "Qm" + Math.random().toString(36).substr(2, 44)
          })
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 800)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (uploadComplete) {
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
                <p className="text-white font-mono">{nftDetails?.tokenId}</p>
              </div>
              <div>
                <span className="text-slate-400 font-light">Initial Value:</span>
                <p className="text-amber-400 font-medium">{nftDetails?.initialValue}</p>
              </div>
              <div>
                <span className="text-slate-400 font-light">Contract:</span>
                <p className="text-white font-mono text-xs">{nftDetails?.contractAddress}</p>
              </div>
              <div>
                <span className="text-slate-400 font-light">IPFS Hash:</span>
                <p className="text-white font-mono text-xs">{nftDetails?.ipfsHash}</p>
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
              onClick={() => {
                setUploadComplete(false)
                setFiles([])
                setNftDetails(null)
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
              }}
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
                  <Label htmlFor="description" className="text-white font-light">Description *</Label>
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
                      <span className="text-lg font-light text-white">Uploading to IPFS & Minting NFT...</span>
                      <span className="text-slate-400">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full h-3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className={`flex items-center ${uploadProgress > 30 ? 'text-green-400' : 'text-slate-400'}`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Uploading files to IPFS
                      </div>
                      <div className={`flex items-center ${uploadProgress > 70 ? 'text-green-400' : 'text-slate-400'}`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Storing metadata on-chain
                      </div>
                      <div className={`flex items-center ${uploadProgress > 95 ? 'text-green-400' : 'text-slate-400'}`}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Minting NFT reward
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
