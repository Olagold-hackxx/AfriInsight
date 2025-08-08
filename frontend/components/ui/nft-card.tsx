"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Coins, Calendar, Hash, Zap, TrendingUp, Download, Heart, Eye, GitFork, Star, MessageCircle, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { UserUpload, DeHugAPI } from "@/lib/api"
import { toast } from 'react-toastify'

interface NFTCardProps {
  upload: UserUpload
  onUpdate?: (upload: UserUpload) => void
}

export function NFTCard({ upload, onUpdate }: NFTCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean
    txHash?: string
    error?: string
  } | null>(null)

  const handleSyncEngagement = async () => {
    setIsLoading(true)
    setLastSyncResult(null)

    try {
      const result = await DeHugAPI.syncNFTEngagement(upload)
      setLastSyncResult(result)

      if (result.success) {
        toast.success(`NFT Synced Successfully! New value: ${result.newValue.toFixed(3)} ETH`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        // Update the upload with new value
        const updatedUpload = {
          ...upload,
          nft: {
            ...upload.nft,
            currentValue: result.newValue,
            lastSyncedAt: new Date().toISOString()
          }
        }
        
        onUpdate?.(updatedUpload)
      } else {
        toast.error(`Sync Failed: ${result.error || "Smart contract interaction failed"}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      toast.error("Network error occurred during sync", {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-600 to-orange-600'
      case 'epic': return 'bg-gradient-to-r from-purple-600 to-pink-600'
      case 'rare': return 'bg-gradient-to-r from-orange-600 to-red-600'
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700'
    }
  }

  const rarityAttribute = upload.nft.attributes.find(attr => attr.trait_type === 'Rarity')
  const rarity = rarityAttribute?.value as string || 'Common'

  // Calculate engagement score for progress bar
  const maxEngagement = 10000 // Arbitrary max for progress calculation
  const currentEngagement = upload.downloads.total + upload.likes + upload.views + upload.forks + upload.stars + upload.comments
  const engagementProgress = Math.min((currentEngagement / maxEngagement) * 100, 100)

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg text-white">{upload.nft.name}</CardTitle>
              <Badge className={`${getRarityColor(rarity)} text-white border-0`}>
                {rarity}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{upload.nft.description}</p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <img 
              src={upload.nft.image || "/placeholder.svg"} 
              alt={upload.nft.name}
              className="w-16 h-16 rounded-lg object-cover border border-orange-500/30"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* NFT Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">#{upload.nft.tokenId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{upload.nft.currentValue.toFixed(3)} ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">{formatDate(upload.nft.mintedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-green-400">Active</span>
          </div>
        </div>

        {/* Attributes */}
        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-2">Attributes</h4>
          <div className="grid grid-cols-2 gap-2">
            {upload.nft.attributes.map((attr, index) => (
              <div key={index} className="bg-gray-800/50 p-2 rounded text-xs border border-gray-700">
                <p className="text-orange-400">{attr.trait_type}</p>
                <p className="text-white font-medium">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Engagement Metrics */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-200">Engagement Impact</h4>
            <span className="text-xs text-orange-400">{engagementProgress.toFixed(1)}%</span>
          </div>
          <Progress value={engagementProgress} className="mb-3 bg-gray-800" />
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">{upload.downloads.total}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-400" />
              <span className="text-gray-300">{upload.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">{upload.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3 text-yellow-400" />
              <span className="text-gray-300">{upload.forks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-purple-400" />
              <span className="text-gray-300">{upload.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-cyan-400" />
              <span className="text-gray-300">{upload.comments}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Sync Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-200">Smart Contract</h4>
            <span className="text-xs text-gray-400">
              Last sync: {formatDate(upload.nft.lastSyncedAt)}
            </span>
          </div>
          
          {lastSyncResult && (
            <div className={`p-2 rounded text-xs mb-2 ${
              lastSyncResult.success 
                ? 'bg-green-900/30 border border-green-500/30 text-green-300' 
                : 'bg-red-900/30 border border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                {lastSyncResult.success ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                <span>
                  {lastSyncResult.success 
                    ? `Synced successfully! TX: ${lastSyncResult.txHash?.substring(0, 10)}...`
                    : lastSyncResult.error
                  }
                </span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSyncEngagement}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Sync Engagement
              </>
            )}
          </Button>
        </div>

        {/* External Links */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-orange-500/50"
            onClick={() => window.open(upload.nft.openseaUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            OpenSea
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-orange-500/50"
            onClick={() => window.open(`https://etherscan.io/address/${upload.nft.contractAddress}`, '_blank')}
          >
            <Hash className="h-4 w-4 mr-2" />
            Contract
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
