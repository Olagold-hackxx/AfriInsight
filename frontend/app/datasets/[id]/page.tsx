"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Share2, Star, Calendar, User, FileText, BarChart3, Shield, Lock, Unlock, AlertTriangle, CheckCircle, Upload, Coins, Trophy, Code, Heart, GitBranch, Database, Filter } from 'lucide-react'
import Link from "next/link"
import { DownloadStatsComponent } from "@/components/ui/download-stats"
import { DownloadButton } from "@/components/ui/download-button"
import { DeHugAPI } from "@/lib/api"

// Mock dataset data
const mockDataset = {
  id: "1",
  title: "Common Crawl Web Text",
  description: "Large-scale web text dataset extracted from Common Crawl for language model training. This dataset contains billions of tokens from web pages across multiple languages, cleaned and filtered for quality.",
  category: "Natural Language Processing",
  author: "common-crawl",
  authorAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  uploadDate: "2024-01-15",
  lastUpdated: "2024-01-20",
  downloads: 45600,
  size: "40.2 GB",
  format: "JSON Lines",
  license: "CC BY 4.0",
  tags: ["web-text", "language-modeling", "large-scale", "multilingual"],
  insights: 156,
  rating: 4.6,
  reviews: 89,
  accessLevel: "public",
  ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  samples: "2.1B tokens",
  languages: ["English", "Spanish", "French", "German", "Chinese"],
  nftDetails: {
    tokenId: "0x5e6f7a8b",
    currentValue: "5.2 ETH",
    initialValue: "0.2 ETH",
    contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    owner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
  },
  files: [
    { name: "train.jsonl", size: "35.8 GB", type: "Training Data", samples: "1.8B" },
    { name: "validation.jsonl", size: "2.1 GB", type: "Validation Data", samples: "150M" },
    { name: "test.jsonl", size: "2.0 GB", type: "Test Data", samples: "150M" },
    { name: "metadata.json", size: "45 KB", type: "Metadata", samples: "1" },
    { name: "README.md", size: "12 KB", type: "Documentation", samples: "1" }
  ],
  sampleData: [
    { id: 1, text: "The quick brown fox jumps over the lazy dog...", language: "en", domain: "example.com", length: 1247 },
    { id: 2, text: "Machine learning is a subset of artificial intelligence...", language: "en", domain: "tech-blog.com", length: 2156 },
    { id: 3, text: "Climate change affects global weather patterns...", language: "en", domain: "science-news.org", length: 1834 },
    { id: 4, text: "The history of ancient civilizations reveals...", language: "en", domain: "history-wiki.edu", length: 2891 },
    { id: 5, text: "Cooking techniques vary across different cultures...", language: "en", domain: "food-blog.net", length: 1456 }
  ],
  usage: {
    pythonCode: `from datasets import load_dataset

# Load dataset from Hugging Face Hub
dataset = load_dataset("common-crawl/web-text")

# Access training split
train_data = dataset["train"]

# Iterate through samples
for sample in train_data:
    print(sample["text"][:100])
    print(f"Language: {sample['language']}")
    print(f"Domain: {sample['domain']}")
    print("---")`,
    dehugCode: `from dehug import DeHugRepository

# Load dataset from decentralized storage
dataset = DeHugRepository.load_dataset("common-crawl/web-text")

# Access training data
train_data = dataset["train"]

# Process samples
for sample in train_data:
    print(f"Text: {sample['text'][:100]}...")
    print(f"Metadata: {sample['metadata']}")`
  },
  statistics: {
    totalSamples: "2.1B",
    avgLength: "1,247 tokens",
    languages: "15",
    domains: "50K+"
  },
  governance: {
    isVerified: true,
    verificationDate: "2024-01-18",
    verifiedBy: "DeHug Verification Committee"
  }
}

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isStarred, setIsStarred] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleDownload = async () => {
    try {
      await DeHugAPI.downloadFromFilecoin(mockDataset.title, mockDataset.ipfsHash, 'ui')
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleAnalyze = () => {
    console.log("Starting analysis...")
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
                  {mockDataset.category}
                </Badge>
                {mockDataset.governance.isVerified && (
                  <Badge className="mr-3 bg-slate-700 text-slate-200 border-slate-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                  {mockDataset.accessLevel === 'public' ? (
                    <><Unlock className="h-3 w-3 mr-1" />Public</>
                  ) : (
                    <><Lock className="h-3 w-3 mr-1" />Private</>
                  )}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">{mockDataset.title}</h1>
              <p className="text-xl text-slate-300 mb-6 font-light leading-relaxed max-w-4xl">{mockDataset.description}</p>
              
              <div className="flex items-center text-sm text-slate-400 space-x-6 font-light">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {mockDataset.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Updated {new Date(mockDataset.lastUpdated).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {mockDataset.downloads.toLocaleString()} downloads
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {mockDataset.insights} insights
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
                itemName={mockDataset.title}
                ipfsHash={mockDataset.ipfsHash}
                className="bg-white text-black hover:bg-slate-100 font-medium"
                onDownloadComplete={() => {
                  console.log("Dataset download completed successfully")
                }}
              />
              <Button onClick={handleAnalyze} className="bg-slate-700 text-white hover:bg-slate-600 font-medium">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Size</p>
                    <p className="text-lg font-light text-white">{mockDataset.size}</p>
                  </div>
                  <Database className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Samples</p>
                    <p className="text-lg font-light text-white">{mockDataset.samples}</p>
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
                    <p className="text-lg font-light text-white">{mockDataset.rating}/5</p>
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
                    <p className="text-lg font-light text-white">{mockDataset.license}</p>
                  </div>
                  <Shield className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <DownloadStatsComponent 
                itemName={mockDataset.title}
                showDetailed={true}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-slate-900/30 border border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Overview</TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Data Preview</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Usage</TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Files</TabsTrigger>
            <TabsTrigger value="nft" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">NFT Details</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">About This Dataset</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-6 font-light leading-relaxed">{mockDataset.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-light text-white mb-3">Key Features:</h4>
                        <ul className="text-sm text-slate-300 space-y-2 font-light">
                          <li>• Massive scale with 2.1B tokens from web crawl</li>
                          <li>• Multi-language support across 15 languages</li>
                          <li>• Quality filtered and deduplicated content</li>
                          <li>• Domain diversity from 50K+ websites</li>
                          <li>• Ready for language model training</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-light text-white mb-3">Use Cases:</h4>
                        <ul className="text-sm text-slate-300 space-y-2 font-light">
                          <li>• Large language model pre-training</li>
                          <li>• Text generation model fine-tuning</li>
                          <li>• Natural language understanding research</li>
                          <li>• Multilingual model development</li>
                          <li>• Web content analysis and research</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Dataset Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">{mockDataset.statistics.totalSamples}</div>
                        <div className="text-slate-400 font-light text-sm">Total Samples</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">{mockDataset.statistics.avgLength}</div>
                        <div className="text-slate-400 font-light text-sm">Avg Length</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">{mockDataset.statistics.languages}</div>
                        <div className="text-slate-400 font-light text-sm">Languages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">{mockDataset.statistics.domains}</div>
                        <div className="text-slate-400 font-light text-sm">Domains</div>
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
                      {mockDataset.tags.map(tag => (
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
                    <CardTitle className="text-white font-light text-xl">Dataset Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-light text-white text-lg">{mockDataset.author}</p>
                        <p className="text-sm text-slate-400 font-light">Data Organization</p>
                      </div>
                      <div className="text-xs text-slate-500 font-light">
                        <p>Wallet: {mockDataset.authorAddress.slice(0, 6)}...{mockDataset.authorAddress.slice(-4)}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mockDataset.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                          {lang}
                        </Badge>
                      ))}
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
                      <code className="text-xs text-slate-300">{mockDataset.ipfsHash.slice(0, 8)}...</code>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Upload Date:</span>
                      <span className="text-slate-300">{new Date(mockDataset.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">File Count:</span>
                      <span className="text-slate-300">{mockDataset.files.length} files</span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Total Size:</span>
                      <span className="text-slate-300">{mockDataset.size}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href={`/insights?dataset=${mockDataset.id}`}>
                      <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate AI Insights
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                      <Eye className="h-4 w-4 mr-2" />
                      View on IPFS
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                      <GitBranch className="h-4 w-4 mr-2" />
                      Fork Dataset
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

          {/* Data Preview Tab */}
          <TabsContent value="preview" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Sample Data</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Preview of dataset samples. Download the full dataset to access all records.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800">
                        <TableHead className="text-slate-300 font-light">ID</TableHead>
                        <TableHead className="text-slate-300 font-light">Text Preview</TableHead>
                        <TableHead className="text-slate-300 font-light">Language</TableHead>
                        <TableHead className="text-slate-300 font-light">Domain</TableHead>
                        <TableHead className="text-slate-300 font-light">Length</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDataset.sampleData.map((row) => (
                        <TableRow key={row.id} className="border-slate-800">
                          <TableCell className="text-slate-300 font-light">{row.id}</TableCell>
                          <TableCell className="text-slate-300 font-light max-w-md">
                            <div className="truncate">{row.text.slice(0, 80)}...</div>
                          </TableCell>
                          <TableCell className="text-slate-300 font-light">{row.language}</TableCell>
                          <TableCell className="text-slate-300 font-light">{row.domain}</TableCell>
                          <TableCell className="text-slate-300 font-light">{row.length.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400 mb-4 font-light">
                    Showing 5 of {mockDataset.samples} samples. Download the full dataset to access all data.
                  </p>
                  <DownloadButton
                    itemName={mockDataset.title}
                    ipfsHash={mockDataset.ipfsHash}
                    size="sm"
                    className="bg-white text-black hover:bg-slate-100 font-medium"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">Datasets Library</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Use with the Hugging Face datasets library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950/50 border border-slate-800 p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-slate-400 text-sm ml-4 font-light">datasets_usage.py</span>
                    </div>
                    <pre className="text-slate-300 text-sm leading-relaxed font-mono overflow-x-auto">
                      <code>{mockDataset.usage.pythonCode}</code>
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
                      <code>{mockDataset.usage.dehugCode}</code>
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
pip install datasets

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
                <CardTitle className="text-white font-light text-xl">Dataset Files</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Individual files included in this dataset package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDataset.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-700">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-slate-400 mr-4" />
                        <div>
                          <p className="font-light text-white">{file.name}</p>
                          <p className="text-sm text-slate-400 font-light">{file.size} • {file.type} • {file.samples} samples</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <DownloadButton
                          itemName={`${mockDataset.title}/${file.name}`}
                          ipfsHash={mockDataset.ipfsHash}
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
                      <p className="text-white font-mono">{mockDataset.nftDetails.tokenId}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Current Value:</span>
                      <p className="text-amber-400 font-medium text-lg">{mockDataset.nftDetails.currentValue}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Initial Value:</span>
                      <p className="text-amber-200">{mockDataset.nftDetails.initialValue}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">Growth:</span>
                      <p className="text-green-400 font-medium">+2500%</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-amber-200/80 font-light text-sm">Contract Address:</span>
                    <p className="text-white font-mono text-xs break-all">{mockDataset.nftDetails.contractAddress}</p>
                  </div>
                  <div>
                    <span className="text-amber-200/80 font-light text-sm">Owner:</span>
                    <p className="text-white font-mono text-xs">{mockDataset.nftDetails.owner.slice(0, 6)}...{mockDataset.nftDetails.owner.slice(-4)}</p>
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
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">Available AI Insights</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  AI-generated insights and analysis for this dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-white mb-2">Generate Your First Insight</h3>
                  <p className="text-slate-400 mb-6 font-light">
                    Use our AI tools to analyze this dataset and generate actionable insights.
                  </p>
                  <Link href={`/insights?dataset=${mockDataset.id}`}>
                    <Button className="bg-white text-black hover:bg-slate-100 font-medium">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate AI Insights
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
