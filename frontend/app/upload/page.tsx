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
import { Upload, FileText, Database, AlertCircle, CheckCircle, X, Sparkles, Shield } from 'lucide-react'
import { useDropzone } from "react-dropzone"

const categories = [
  "Agriculture",
  "Health", 
  "Education",
  "Climate",
  "Demographics",
  "Economics",
  "Transportation",
  "Energy",
  "Water Resources",
  "Urban Planning"
]

const licenses = [
  { value: "cc0", label: "CC0 - Public Domain" },
  { value: "cc-by", label: "CC BY - Attribution" },
  { value: "cc-by-sa", label: "CC BY-SA - Attribution ShareAlike" },
  { value: "odc-by", label: "ODC-BY - Open Data Commons Attribution" },
  { value: "custom", label: "Custom License" }
]

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    license: "",
    customLicense: "",
    isPublic: true,
    allowCommercial: false,
    source: "",
    methodology: ""
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 100 * 1024 * 1024 // 100MB
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
          return 100
        }
        return prev + 10
      })
    }, 500)
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Upload Successful!
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your dataset has been uploaded to IPFS and is now available on the AfriData platform. 
            It may take a few minutes to appear in search results.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/datasets'}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full"
            >
              Browse Datasets
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                setUploadComplete(false)
                setFiles([])
                setFormData({
                  title: "",
                  description: "",
                  category: "",
                  tags: "",
                  license: "",
                  customLicense: "",
                  isPublic: true,
                  allowCommercial: false,
                  source: "",
                  methodology: ""
                })
              }}
              className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 px-8 py-4 text-lg rounded-full"
            >
              Upload Another Dataset
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 text-green-300 px-4 py-2 backdrop-blur-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Decentralized Storage
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent">
                Upload
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Dataset
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Share your data with the African research community. Your dataset will be stored on IPFS for permanent, decentralized access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Files
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload CSV, JSON, XLS, or XLSX files. Maximum file size: 100MB per file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-white/20 hover:border-white/30 bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-green-400 text-lg">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-300 mb-2 text-lg">
                        Drag and drop your files here, or click to select files
                      </p>
                      <p className="text-sm text-gray-500">
                        Supported formats: CSV, JSON, XLS, XLSX
                      </p>
                    </div>
                  )}
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-white">Selected Files:</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <span className="text-sm font-medium text-white">{file.name}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dataset Information */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Dataset Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Provide details about your dataset to help others discover and understand it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Kenya Agricultural Production 2023"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10 text-white">
                        {categories.map(category => (
                          <SelectItem key={category} value={category.toLowerCase()} className="focus:bg-white/10">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your dataset, its contents, collection methodology, and potential use cases..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-white">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="agriculture, kenya, crops, rainfall (comma-separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50"
                    />
                    <p className="text-xs text-gray-500">
                      Add relevant tags to help others discover your dataset
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source" className="text-white">Data Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., Ministry of Agriculture, WHO, etc."
                      value={formData.source}
                      onChange={(e) => handleInputChange('source', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodology" className="text-white">Collection Methodology (Optional)</Label>
                  <Textarea
                    id="methodology"
                    placeholder="Describe how the data was collected, processed, or generated..."
                    rows={3}
                    value={formData.methodology}
                    onChange={(e) => handleInputChange('methodology', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Licensing */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Licensing & Permissions</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose how others can use your dataset.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="license" className="text-white">License *</Label>
                  <Select value={formData.license} onValueChange={(value) => handleInputChange('license', value)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a license" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10 text-white">
                      {licenses.map(license => (
                        <SelectItem key={license.value} value={license.value} className="focus:bg-white/10">
                          {license.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.license === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="customLicense" className="text-white">Custom License Details</Label>
                    <Textarea
                      id="customLicense"
                      placeholder="Describe your custom license terms..."
                      rows={3}
                      value={formData.customLicense}
                      onChange={(e) => handleInputChange('customLicense', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-500/50"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked as boolean)}
                      className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="isPublic" className="text-sm text-white">
                      Make this dataset publicly discoverable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowCommercial"
                      checked={formData.allowCommercial}
                      onCheckedChange={(checked) => handleInputChange('allowCommercial', checked as boolean)}
                      className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="allowCommercial" className="text-sm text-white">
                      Allow commercial use of this dataset
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {isUploading && (
              <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Uploading to IPFS...</span>
                      <span className="text-sm text-gray-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full h-2" />
                    <p className="text-xs text-gray-500">
                      Your files are being uploaded to the decentralized network. This may take a few minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center text-sm text-gray-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                By uploading, you agree to our Terms of Service and Data Policy
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={files.length === 0 || !formData.title || !formData.description || !formData.category || !formData.license || isUploading}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 rounded-full disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload Dataset'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
