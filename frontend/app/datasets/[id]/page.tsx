"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Share2, Star, Calendar, User, FileText, BarChart3, Shield, Lock, Unlock, AlertTriangle, CheckCircle, Upload } from 'lucide-react'
import Link from "next/link"

// Mock dataset data
const mockDataset = {
  id: "1",
  title: "Kenya Agricultural Production 2020-2023",
  description: "Comprehensive data on crop yields, rainfall patterns, and farming practices across Kenya's agricultural regions. This dataset includes detailed information about maize, wheat, rice, and other staple crops, along with corresponding weather data and soil conditions.",
  category: "Agriculture",
  author: "Kenya Ministry of Agriculture",
  authorAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  uploadDate: "2024-01-15",
  lastUpdated: "2024-01-20",
  downloads: 1247,
  size: "2.3 MB",
  format: "CSV",
  license: "CC BY 4.0",
  tags: ["agriculture", "kenya", "crops", "rainfall", "farming"],
  insights: 23,
  rating: 4.8,
  reviews: 156,
  accessLevel: "public",
  ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  files: [
    { name: "crop_yields_2020_2023.csv", size: "1.8 MB", type: "CSV" },
    { name: "rainfall_data.csv", size: "450 KB", type: "CSV" },
    { name: "soil_conditions.csv", size: "120 KB", type: "CSV" },
    { name: "metadata.json", size: "15 KB", type: "JSON" }
  ],
  sampleData: [
    { region: "Central Kenya", crop: "Maize", year: 2023, yield_tons: 2450, rainfall_mm: 1200, soil_ph: 6.2 },
    { region: "Western Kenya", crop: "Maize", year: 2023, yield_tons: 3100, rainfall_mm: 1450, soil_ph: 6.8 },
    { region: "Eastern Kenya", crop: "Wheat", year: 2023, yield_tons: 1200, rainfall_mm: 800, soil_ph: 6.5 },
    { region: "Rift Valley", crop: "Rice", year: 2023, yield_tons: 1800, rainfall_mm: 1100, soil_ph: 6.0 },
    { region: "Coast", crop: "Maize", year: 2023, yield_tons: 1950, rainfall_mm: 950, soil_ph: 5.8 }
  ],
  governance: {
    isVerified: true,
    verificationDate: "2024-01-18",
    verifiedBy: "AfriData Verification Committee",
    requiresApproval: false,
    accessTokens: 0
  }
}

export default function DatasetDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isStarred, setIsStarred] = useState(false)

  const handleDownload = () => {
    // Simulate download
    console.log("Downloading dataset...")
  }

  const handleRequestAccess = () => {
    // Simulate access request for restricted datasets
    console.log("Requesting access...")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Badge variant="secondary" className="mr-3">
                {mockDataset.category}
              </Badge>
              {mockDataset.governance.isVerified && (
                <Badge variant="default" className="mr-3 bg-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="outline">
                {mockDataset.accessLevel === 'public' ? (
                  <><Unlock className="h-3 w-3 mr-1" />Public</>
                ) : (
                  <><Lock className="h-3 w-3 mr-1" />Restricted</>
                )}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockDataset.title}</h1>
            <p className="text-gray-600 mb-4">{mockDataset.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {mockDataset.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Updated {new Date(mockDataset.lastUpdated).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                {mockDataset.downloads.toLocaleString()} downloads
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                {mockDataset.insights} insights
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star className={`h-4 w-4 mr-2 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              {isStarred ? 'Starred' : 'Star'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {mockDataset.accessLevel === 'public' ? (
              <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            ) : (
              <Button onClick={handleRequestAccess} className="bg-blue-600 hover:bg-blue-700">
                <Lock className="h-4 w-4 mr-2" />
                Request Access
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">File Size</p>
                  <p className="text-lg font-semibold">{mockDataset.size}</p>
                </div>
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-lg font-semibold">{mockDataset.rating}/5</p>
                </div>
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">License</p>
                  <p className="text-lg font-semibold">{mockDataset.license}</p>
                </div>
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Format</p>
                  <p className="text-lg font-semibold">{mockDataset.format}</p>
                </div>
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Preview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Dataset</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{mockDataset.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Comprehensive crop yield data across 47 counties</li>
                        <li>• Weather pattern correlation analysis</li>
                        <li>• Soil condition measurements and pH levels</li>
                        <li>• 4-year historical trend analysis (2020-2023)</li>
                        <li>• GPS coordinates for all measurement points</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Use Cases:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Agricultural policy development</li>
                        <li>• Crop yield prediction models</li>
                        <li>• Climate impact assessment</li>
                        <li>• Food security planning</li>
                        <li>• Research and academic studies</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockDataset.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{mockDataset.author}</p>
                      <p className="text-sm text-gray-600">Government Institution</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Wallet: {mockDataset.authorAddress.slice(0, 6)}...{mockDataset.authorAddress.slice(-4)}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IPFS Hash:</span>
                    <code className="text-xs">{mockDataset.ipfsHash.slice(0, 8)}...</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Upload Date:</span>
                    <span>{new Date(mockDataset.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">File Count:</span>
                    <span>{mockDataset.files.length} files</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Size:</span>
                    <span>{mockDataset.size}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/insights?dataset=${mockDataset.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate AI Insights
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View on IPFS
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Data Preview Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Sample rows from the dataset. Download the full dataset to access all records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Yield (tons)</TableHead>
                      <TableHead>Rainfall (mm)</TableHead>
                      <TableHead>Soil pH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDataset.sampleData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.crop}</TableCell>
                        <TableCell>{row.year}</TableCell>
                        <TableCell>{row.yield_tons.toLocaleString()}</TableCell>
                        <TableCell>{row.rainfall_mm}</TableCell>
                        <TableCell>{row.soil_ph}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Showing 5 of 15,000+ records. Download the full dataset to access all data.
                </p>
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Dataset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Files</CardTitle>
              <CardDescription>
                Individual files included in this dataset package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDataset.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-600">{file.size} • {file.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available AI Insights</CardTitle>
              <CardDescription>
                AI-generated insights and analysis for this dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Generate Your First Insight</h3>
                <p className="text-gray-600 mb-4">
                  Use our AI tools to analyze this dataset and generate actionable insights.
                </p>
                <Link href={`/insights?dataset=${mockDataset.id}`}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate AI Insights
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-green-900">Verified Dataset</p>
                      <p className="text-sm text-green-700">Verified by {mockDataset.governance.verifiedBy}</p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Verified
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Verification Date:</strong> {new Date(mockDataset.governance.verificationDate).toLocaleDateString()}</p>
                  <p><strong>Verification Process:</strong> Multi-party signature approval</p>
                  <p><strong>Data Quality Score:</strong> 9.2/10</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Unlock className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">Public Access</p>
                      <p className="text-sm text-blue-700">No restrictions or tokens required</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    Open
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p><strong>Access Level:</strong> Public</p>
                  <p><strong>Required Tokens:</strong> {mockDataset.governance.accessTokens}</p>
                  <p><strong>Commercial Use:</strong> Allowed under CC BY 4.0</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Governance History</CardTitle>
              <CardDescription>
                Track record of governance decisions and approvals for this dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Dataset Verified</p>
                    <p className="text-sm text-gray-600">Approved by 3/3 required signatures from verification committee</p>
                    <p className="text-xs text-gray-500">{new Date(mockDataset.governance.verificationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50">
                  <Upload className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Dataset Published</p>
                    <p className="text-sm text-gray-600">Initial upload and metadata validation completed</p>
                    <p className="text-xs text-gray-500">{new Date(mockDataset.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
