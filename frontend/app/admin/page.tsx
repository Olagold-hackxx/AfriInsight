"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, Download, Coins, TrendingUp, RefreshCw, BarChart3, Zap, Crown, Trophy, Target } from 'lucide-react'
import { DeHugAPI, UserUpload, PortfolioStats } from "@/lib/api"
import { UploadCard } from "@/components/ui/upload-card"
import { NFTCard } from "@/components/ui/nft-card"
import { toast } from 'react-toastify'

export default function AdminPage() {
  const [uploads, setUploads] = useState<UserUpload[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUpload, setSelectedUpload] = useState<UserUpload | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [uploadsData, statsData] = await Promise.all([
        DeHugAPI.getUserUploads(),
        DeHugAPI.getPortfolioStats()
      ])
      setUploads(uploadsData)
      setStats(statsData)
    } catch (error) {
      toast.error("Failed to load dashboard data", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    toast.info("Refreshing dashboard data...", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    loadData()
  }

  const handleUploadUpdate = (updatedUpload: UserUpload) => {
    setUploads(prev => prev.map(upload => 
      upload.id === updatedUpload.id ? updatedUpload : upload
    ))
    // Recalculate stats
    loadData()
  }

  const topUploads = uploads
    .sort((a, b) => b.downloads.total - a.downloads.total)
    .slice(0, 3)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-orange-400" />
            <span className="ml-2 text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Creator Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your uploads, NFTs, and engagement</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="border-gray-700 hover:border-orange-500/50 hover:bg-gray-900">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-200">Total Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Upload className="h-8 w-8 text-orange-400 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalUploads}</p>
                    <p className="text-xs text-orange-300">Models & Datasets</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-200">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Download className="h-8 w-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
                    <p className="text-xs text-green-300">All Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-200">NFT Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Coins className="h-8 w-8 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalNFTValue.toFixed(2)} ETH</p>
                    <p className="text-xs text-yellow-300">Current Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.totalEngagement.toLocaleString()}</p>
                    <p className="text-xs text-purple-300">Total Interactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Performers */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUploads.map((upload, index) => (
                <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Badge className={`
                      ${index === 0 ? 'bg-yellow-600' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}
                      text-white
                    `}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-white">{upload.name}</p>
                      <p className="text-sm text-gray-400">{upload.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{upload.downloads.total}</p>
                    <p className="text-xs text-gray-400">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="uploads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border-gray-800">
            <TabsTrigger value="uploads" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Upload className="h-4 w-4 mr-2" />
              My Uploads
            </TabsTrigger>
            <TabsTrigger value="nfts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Crown className="h-4 w-4 mr-2" />
              NFT Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Uploads</h2>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                {uploads.length} items
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <UploadCard 
                  key={upload.id} 
                  upload={upload} 
                  onViewNFT={setSelectedUpload}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">NFT Collection</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                  {uploads.length} NFTs
                </Badge>
                <Badge className="bg-yellow-600 text-white">
                  {stats?.totalNFTValue.toFixed(2)} ETH
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <NFTCard 
                  key={upload.id} 
                  upload={upload} 
                  onUpdate={handleUploadUpdate}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Detailed Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Download Sources */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Download Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{upload.name}</span>
                          <span className="text-gray-400">{upload.downloads.total}</span>
                        </div>
                        <div className="flex gap-1 h-2">
                          <div 
                            className="bg-orange-500 rounded-l"
                            style={{ 
                              width: `${(upload.downloads.sdk / upload.downloads.total) * 100}%` 
                            }}
                          />
                          <div 
                            className="bg-green-500 rounded-r"
                            style={{ 
                              width: `${(upload.downloads.ui / upload.downloads.total) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>SDK: {upload.downloads.sdk}</span>
                          <span>UI: {upload.downloads.ui}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Breakdown */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Engagement Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="p-3 bg-gray-800/50 rounded border border-gray-700">
                        <h4 className="font-medium text-white mb-2">{upload.name}</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-red-400 font-bold">{upload.likes}</p>
                            <p className="text-gray-400">Likes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 font-bold">{upload.views}</p>
                            <p className="text-gray-400">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="text-green-400 font-bold">{upload.forks}</p>
                            <p className="text-gray-400">Forks</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
