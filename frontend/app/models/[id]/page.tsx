"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Share2, Star, Calendar, User, FileText, BarChart3, Shield, Lock, Unlock, AlertTriangle, CheckCircle, Upload, Coins, Trophy, Code, Play, Heart, GitBranch, Cpu, Users } from 'lucide-react'
import { DownloadStatsComponent } from "@/components/ui/download-stats"
import { DownloadButton } from "@/components/ui/download-button"
import { DeHugAPI } from "@/lib/api"

// Mock model data
const mockModel = {
  id: "1",
  title: "GPT-2 Small Fine-tuned",
  description: "A fine-tuned GPT-2 model for creative writing with enhanced storytelling capabilities. This model has been trained on a curated dataset of literature and creative writing samples to improve its ability to generate coherent, engaging narratives.",
  category: "Natural Language Processing",
  task: "Text Generation",
  author: "openai-community",
  authorAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  uploadDate: "2024-01-15",
  lastUpdated: "2024-01-20",
  downloads: 124700,
  size: "548 MB",
  format: "PyTorch",
  license: "MIT",
  tags: ["gpt-2", "text-generation", "creative-writing", "fine-tuned"],
  likes: 2340,
  rating: 4.8,
  reviews: 156,
  accessLevel: "public",
  ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  nftDetails: {
    tokenId: "0x1a2b3c4d",
    currentValue: "2.4 ETH",
    initialValue: "0.1 ETH",
    contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    owner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
  },
  files: [
    { name: "pytorch_model.bin", size: "510 MB", type: "Model Weights" },
    { name: "config.json", size: "2 KB", type: "Configuration" },
    { name: "tokenizer.json", size: "466 KB", type: "Tokenizer" },
    { name: "README.md", size: "8 KB", type: "Documentation" }
  ],
  usage: {
    pythonCode: `from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load model and tokenizer
model = GPT2LMHeadModel.from_pretrained("openai-community/gpt2-small-finetuned")
tokenizer = GPT2Tokenizer.from_pretrained("openai-community/gpt2-small-finetuned")

# Generate text
input_text = "Once upon a time"
inputs = tokenizer.encode(input_text, return_tensors="pt")
outputs = model.generate(inputs, max_length=100, temperature=0.8)
generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(generated_text)`,
    dehugCode: `from dehug import DeHugRepository

# Load model from decentralized storage
model = DeHugRepository.load_model("openai-community/gpt2-small-finetuned")

# Generate text
output = model.generate("Once upon a time", max_length=100)
print(output)`
  },
  performance: {
    accuracy: "85.2%",
    latency: "45ms",
    throughput: "120 tokens/sec",
    memoryUsage: "2.1 GB"
  },
  governance: {
    isVerified: true,
    verificationDate: "2024-01-18",
    verifiedBy: "DeHug Verification Committee"
  }
}

export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isStarred, setIsStarred] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleDownload = async () => {
    try {
      await DeHugAPI.downloadFromFilecoin(mockModel.title, mockModel.ipfsHash, 'ui')
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleUseInference = () => {
    console.log("Starting inference...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Badge variant="outline" className="mr-3 border-slate-700 text-slate-300 bg-slate-800/30">
                  {mockModel.task}
                </Badge>
                {mockModel.governance.isVerified && (
                  <Badge className="mr-3 bg-slate-700 text-slate-200 border-slate-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                  {mockModel.accessLevel === 'public' ? (
                    <><Unlock className="h-3 w-3 mr-1" />Public</>
                  ) : (
                    <><Lock className="h-3 w-3 mr-1" />Private</>
                  )}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">{mockModel.title}</h1>
              <p className="text-xl text-slate-300 mb-6 font-light leading-relaxed max-w-4xl">{mockModel.description}</p>
              
              <div className="flex items-center text-sm text-slate-400 space-x-6 font-light">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {mockModel.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Updated {new Date(mockModel.lastUpdated).toLocaleDateString()}
                </div>
                {/* <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {mockModel.downloads.toLocaleString()} downloads
                </div> */}
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  {mockModel.likes.toLocaleString()} likes
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStarred(!isStarred)}
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Star className={`h-4 w-4 mr-2 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {isStarred ? 'Starred' : 'Star'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-400 text-red-400' : ''}`} />
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DownloadButton
                itemName={mockModel.title}
                ipfsHash={mockModel.ipfsHash}
                className="bg-white text-black hover:bg-slate-100 font-medium"
                onDownloadComplete={() => {
                  // Optionally refresh stats or show notification
                  console.log("Download completed successfully")
                }}
              />
              <Button onClick={handleUseInference} className="bg-slate-700 text-white hover:bg-slate-600 font-medium">
                <Play className="h-4 w-4 mr-2" />
                Use Model
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">File Size</p>
                    <p className="text-lg font-light text-white">{mockModel.size}</p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Rating</p>
                    <p className="text-lg font-light text-white">{mockModel.rating}/5</p>
                  </div>
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">License</p>
                    <p className="text-lg font-light text-white">{mockModel.license}</p>
                  </div>
                  <Shield className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Format</p>
                    <p className="text-lg font-light text-white">{mockModel.format}</p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border-amber-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-200/80 font-light">NFT Value</p>
                    <p className="text-lg font-light text-amber-400">{mockModel.nftDetails.currentValue}</p>
                  </div>
                  <Coins className="h-6 w-6 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>
          <DownloadStatsComponent 
            itemName={mockModel.title}
            className="lg:col-span-2"
            showDetailed={true}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-slate-900/30 border border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Overview</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Usage</TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Files</TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Performance</TabsTrigger>
            <TabsTrigger value="nft" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">NFT Details</TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Community</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">About This Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-6 font-light leading-relaxed">{mockModel.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-light text-white mb-3">Key Features:</h4>
                        <ul className="text-sm text-slate-300 space-y-2 font-light">
                          <li>• Fine-tuned on curated creative writing dataset</li>
                          <li>• Enhanced narrative coherence and creativity</li>
                          <li>• Optimized for story generation and creative tasks</li>
                          <li>• Compatible with Hugging Face transformers</li>
                          <li>• Supports various generation parameters</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-light text-white mb-3">Use Cases:</h4>
                        <ul className="text-sm text-slate-300 space-y-2 font-light">
                          <li>• Creative writing assistance</li>
                          <li>• Story and narrative generation</li>
                          <li>• Content creation for games and media</li>
                          <li>• Educational writing tools</li>
                          <li>• Research in creative AI</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mockModel.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                {/* Author Info */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Model Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-light text-white text-lg">{mockModel.author}</p>
                        <p className="text-sm text-slate-400 font-light">Community Contributor</p>
                      </div>
                      <div className="text-xs text-slate-500 font-light">
                        <p>Wallet: {mockModel.authorAddress.slice(0, 6)}...{mockModel.authorAddress.slice(-4)}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Details */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">IPFS Hash:</span>
                      <code className="text-xs text-slate-300">{mockModel.ipfsHash.slice(0, 8)}...</code>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Upload Date:</span>
                      <span className="text-slate-300">{new Date(mockModel.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">File Count:</span>
                      <span className="text-slate-300">{mockModel.files.length} files</span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Total Size:</span>
                      <span className="text-slate-300">{mockModel.size}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                      <Cpu className="h-4 w-4 mr-2" />
                      Try in Playground
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                      <Eye className="h-4 w-4 mr-2" />
                      View on IPFS
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Fork Model
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">Transformers Library</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Use with the standard Hugging Face transformers library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950/50 border border-slate-800 p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-slate-400 text-sm ml-4 font-light">transformers_usage.py</span>
                    </div>
                    <pre className="text-slate-300 text-sm leading-relaxed font-mono overflow-x-auto">
                      <code>{mockModel.usage.pythonCode}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">DeHug SDK</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Use with our decentralized SDK for direct IPFS access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950/50 border border-slate-800 p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-slate-400 text-sm ml-4 font-light">dehug_usage.py</span>
                    </div>
                    <pre className="text-slate-300 text-sm leading-relaxed font-mono overflow-x-auto">
                      <code>{mockModel.usage.dehugCode}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950/50 border border-slate-800 p-4">
                  <pre className="text-slate-300 text-sm font-mono">
                    <code>{`# Install required packages
pip install transformers torch

# Or use our decentralized SDK
pip install dehug`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Model Files</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Individual files included in this model package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockModel.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-700">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-slate-400 mr-4" />
                        <div>
                          <p className="font-light text-white">{file.name}</p>
                          <p className="text-sm text-slate-400 font-light">{file.size} • {file.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <DownloadButton
                          itemName={`${mockModel.title}/${file.name}`}
                          ipfsHash={mockModel.ipfsHash}
                          size="sm"
                          className="bg-white text-black hover:bg-slate-100 font-medium"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-white mb-2">{mockModel.performance.accuracy}</div>
                  <div className="text-slate-400 font-light">Accuracy</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-white mb-2">{mockModel.performance.latency}</div>
                  <div className="text-slate-400 font-light">Latency</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-white mb-2">{mockModel.performance.throughput}</div>
                  <div className="text-slate-400 font-light">Throughput</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-light text-white mb-2">{mockModel.performance.memoryUsage}</div>
                  <div className="text-slate-400 font-light">Memory Usage</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Benchmark Results</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Performance metrics on standard evaluation datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-white mb-2">Benchmark Data Coming Soon</h3>
                  <p className="text-slate-400 font-light">
                    Detailed performance benchmarks will be available once the model is evaluated.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Details Tab */}
          <TabsContent value="nft" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border-amber-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-light text-xl">
                    <Trophy className="h-6 w-6 mr-3 text-amber-400" />
                    NFT Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Token ID:</span>
                      <p className="text-white font-mono">{mockModel.nftDetails.tokenId}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Current Value:</span>
                      <p className="text-amber-400 font-medium text-lg">{mockModel.nftDetails.currentValue}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Initial Value:</span>
                      <p className="text-amber-200">{mockModel.nftDetails.initialValue}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Growth:</span>
                      <p className="text-green-400 font-medium">+2300%</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-amber-200/80 font-light text-sm">Contract Address:</span>
                    <p className="text-white font-mono text-xs break-all">{mockModel.nftDetails.contractAddress}</p>
                  </div>
                  <div>
                    <span className="text-amber-200/80 font-light text-sm">Owner:</span>
                    <p className="text-white font-mono text-xs">{mockModel.nftDetails.owner.slice(0, 6)}...{mockModel.nftDetails.owner.slice(-4)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">Value History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-light text-white mb-2">Value Chart Coming Soon</h3>
                    <p className="text-slate-400 font-light">
                      Historical value tracking will be available as the NFT gains more activity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">How NFT Value Increases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Downloads</h4>
                    <p className="text-sm text-slate-400 font-light">
                      Each download increases the NFT value based on usage metrics
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Community Engagement</h4>
                    <p className="text-sm text-slate-400 font-light">
                      Likes, stars, and community interaction boost NFT value
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Performance</h4>
                    <p className="text-sm text-slate-400 font-light">
                      High-performing models with good benchmarks increase in value
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Community Feedback</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Reviews and discussions from the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-white mb-2">Community Features Coming Soon</h3>
                  <p className="text-slate-400 font-light">
                    Reviews, discussions, and community features will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
