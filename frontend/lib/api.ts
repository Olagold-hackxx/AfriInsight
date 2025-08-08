import axios from 'axios'

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface DownloadStats {
  sdk: number
  ui: number
  total: number
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
}

export interface NFTMetadata {
  tokenId: string
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
  contractAddress: string
  currentValue: number
  mintedAt: string
  lastSyncedAt: string
  openseaUrl: string
}

export interface UserUpload {
  id: string
  name: string
  description: string
  type: 'model' | 'dataset'
  author: string
  uploadedAt: string
  fileSize: string
  license: string
  tags: string[]
  downloads: DownloadStats
  likes: number
  views: number
  forks: number
  stars: number
  comments: number
  nft: NFTMetadata
}

export interface PortfolioStats {
  totalUploads: number
  totalDownloads: number
  totalNFTValue: number
  totalEngagement: number
}

// API Functions
export const DeHugAPI = {
  // Track download
  async trackDownload(itemName: string, source: 'ui' | 'sdk'): Promise<void> {
    try {
      const formData = new FormData()
      formData.append('item_name', itemName)
      formData.append('source', source)
      
      await apiClient.post('/track/download', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error) {
      console.warn('Error tracking download:', error)
    }
  },

  // Get download stats
  async getDownloadStats(): Promise<Record<string, DownloadStats>> {
    try {
      const response = await apiClient.get('/track/stats')
      return response.data
    } catch (error) {
      console.warn('Error fetching stats:', error)
      return {}
    }
  },

  // Download from Filecoin/IPFS
  async downloadFromFilecoin(itemName: string, source: 'ui' | 'sdk' = 'ui'): Promise<string> {
    try {
      // Track the download
      await this.trackDownload(itemName, source)
      
      // Simulate IPFS gateway URL
      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`
      const downloadUrl = `https://ipfs.io/ipfs/${ipfsHash}/${itemName}`
      
      // Create download link
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = itemName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return downloadUrl
    } catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  },

  // Get user uploads (mock data)
  async getUserUploads(): Promise<UserUpload[]> {
    // Mock data - replace with real API call
    return [
      {
        id: '1',
        name: 'African Language Model v2.1',
        description: 'Advanced multilingual model trained on 15 African languages including Swahili, Yoruba, Amharic, and Zulu.',
        type: 'model',
        author: 'Dr. Amara Okafor',
        uploadedAt: '2024-01-15T10:30:00Z',
        fileSize: '2.3 GB',
        license: 'MIT',
        tags: ['nlp', 'multilingual', 'african-languages', 'transformer'],
        downloads: { sdk: 1247, ui: 856, total: 2103 },
        likes: 342,
        views: 5678,
        forks: 89,
        stars: 456,
        comments: 67,
        nft: {
          tokenId: '1001',
          name: 'African Language Model NFT',
          description: 'NFT representing the African Language Model v2.1',
          image: '/african-ai-nft.png',
          attributes: [
            { trait_type: 'Type', value: 'Language Model' },
            { trait_type: 'Languages', value: 15 },
            { trait_type: 'Rarity', value: 'Epic' },
            { trait_type: 'Performance', value: 'High' }
          ],
          contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681',
          currentValue: 0.847,
          mintedAt: '2024-01-15T10:35:00Z',
          lastSyncedAt: '2024-01-20T14:22:00Z',
          openseaUrl: 'https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681/1001'
        }
      },
      {
        id: '2',
        name: 'Swahili Speech Dataset',
        description: 'Comprehensive speech dataset with 50,000 hours of Swahili audio from various dialects and regions.',
        type: 'dataset',
        author: 'Prof. Kesi Mwangi',
        uploadedAt: '2024-01-10T08:15:00Z',
        fileSize: '847 MB',
        license: 'CC BY 4.0',
        tags: ['speech', 'swahili', 'audio', 'dataset', 'asr'],
        downloads: { sdk: 892, ui: 1205, total: 2097 },
        likes: 278,
        views: 4321,
        forks: 45,
        stars: 312,
        comments: 89,
        nft: {
          tokenId: '1002',
          name: 'Swahili Speech Dataset NFT',
          description: 'NFT for the comprehensive Swahili speech dataset',
          image: '/swahili-dataset-nft.png',
          attributes: [
            { trait_type: 'Type', value: 'Speech Dataset' },
            { trait_type: 'Hours', value: 50000 },
            { trait_type: 'Rarity', value: 'Rare' },
            { trait_type: 'Quality', value: 'Premium' }
          ],
          contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681',
          currentValue: 0.623,
          mintedAt: '2024-01-10T08:20:00Z',
          lastSyncedAt: '2024-01-19T16:45:00Z',
          openseaUrl: 'https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681/1002'
        }
      },
      {
        id: '3',
        name: 'Yoruba Text Classification Model',
        description: 'Fine-tuned BERT model for Yoruba text classification with 94% accuracy on news categorization.',
        type: 'model',
        author: 'Dr. Adebayo Olumide',
        uploadedAt: '2024-01-08T14:45:00Z',
        fileSize: '1.1 GB',
        license: 'Apache 2.0',
        tags: ['bert', 'yoruba', 'classification', 'nlp', 'news'],
        downloads: { sdk: 567, ui: 423, total: 990 },
        likes: 189,
        views: 2876,
        forks: 34,
        stars: 201,
        comments: 45,
        nft: {
          tokenId: '1003',
          name: 'Yoruba Classification NFT',
          description: 'NFT for the Yoruba text classification model',
          image: '/yoruba-speech-nft.png',
          attributes: [
            { trait_type: 'Type', value: 'Classification Model' },
            { trait_type: 'Accuracy', value: '94%' },
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Language', value: 'Yoruba' }
          ],
          contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681',
          currentValue: 1.234,
          mintedAt: '2024-01-08T14:50:00Z',
          lastSyncedAt: '2024-01-18T11:30:00Z',
          openseaUrl: 'https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C9db96DfB3f681/1003'
        }
      }
    ]
  },

  // Get portfolio stats
  async getPortfolioStats(): Promise<PortfolioStats> {
    const uploads = await this.getUserUploads()
    
    return {
      totalUploads: uploads.length,
      totalDownloads: uploads.reduce((sum, upload) => sum + upload.downloads.total, 0),
      totalNFTValue: uploads.reduce((sum, upload) => sum + upload.nft.currentValue, 0),
      totalEngagement: uploads.reduce((sum, upload) => 
        sum + upload.likes + upload.views + upload.forks + upload.stars + upload.comments, 0
      )
    }
  },

  // Sync NFT engagement to smart contract (mock)
  async syncNFTEngagement(upload: UserUpload): Promise<{ success: boolean; newValue: number; txHash?: string; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Calculate engagement score
      const engagementScore = 
        (upload.downloads.total * 10) +
        (upload.forks * 20) +
        (upload.stars * 8) +
        (upload.likes * 5) +
        (upload.comments * 3) +
        (upload.views * 1)
      
      // Calculate new NFT value based on engagement
      const baseValue = 0.1
      const engagementMultiplier = Math.log(engagementScore + 1) / 10
      const newValue = baseValue + engagementMultiplier
      
      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        return {
          success: true,
          newValue: parseFloat(newValue.toFixed(3)),
          txHash
        }
      } else {
        return {
          success: false,
          newValue: upload.nft.currentValue,
          error: 'Smart contract interaction failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        newValue: upload.nft.currentValue,
        error: 'Network error occurred'
      }
    }
  }
}
