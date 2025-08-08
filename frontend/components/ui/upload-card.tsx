"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Download, Eye, Heart, GitFork, Star, MessageCircle, FileText, User, Scale, Coins, Zap } from 'lucide-react'
import { UserUpload } from "@/lib/api"

interface UploadCardProps {
  upload: UserUpload
  onViewNFT: (upload: UserUpload) => void
}

export function UploadCard({ upload, onViewNFT }: UploadCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTypeColor = (type: string) => {
    return type === 'model' ? 'bg-orange-600' : 'bg-green-600'
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-yellow-400'
      case 'epic': return 'text-purple-400'
      case 'rare': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const rarityAttribute = upload.nft.attributes.find(attr => attr.trait_type === 'Rarity')
  const rarity = rarityAttribute?.value as string || 'Common'

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-500/50 transition-all duration-300 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg text-white">{upload.name}</CardTitle>
              <Badge className={`${getTypeColor(upload.type)} text-white`}>
                {upload.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{upload.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Upload Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">{upload.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">{upload.fileSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">{formatDate(upload.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">{upload.license}</span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex flex-wrap gap-1">
            {upload.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
                {tag}
              </Badge>
            ))}
            {upload.tags.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
                +{upload.tags.length - 4}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Download Stats */}
        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-2">Download Statistics</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-orange-900/20 p-2 rounded border border-orange-500/30">
              <p className="text-lg font-bold text-orange-400">{upload.downloads.sdk}</p>
              <p className="text-xs text-gray-400">SDK</p>
            </div>
            <div className="bg-green-900/20 p-2 rounded border border-green-500/30">
              <p className="text-lg font-bold text-green-400">{upload.downloads.ui}</p>
              <p className="text-xs text-gray-400">UI</p>
            </div>
            <div className="bg-purple-900/20 p-2 rounded border border-purple-500/30">
              <p className="text-lg font-bold text-purple-400">{upload.downloads.total}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-200 mb-2">Engagement</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-400" />
              <span className="text-gray-300">{upload.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">{upload.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">{upload.forks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-gray-300">{upload.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-purple-400" />
              <span className="text-gray-300">{upload.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3 text-cyan-400" />
              <span className="text-gray-300">{upload.downloads.total}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* NFT Preview */}
        <div className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 p-3 rounded-lg border border-orange-500/30">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-orange-200">Associated NFT</p>
              <p className="text-xs text-gray-400">Token #{upload.nft.tokenId}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="font-bold text-yellow-400">{upload.nft.currentValue.toFixed(3)} ETH</span>
              </div>
              <p className={`text-xs font-medium ${getRarityColor(rarity)}`}>{rarity}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => onViewNFT(upload)}
            size="sm" 
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Manage NFT
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
