import axios from "axios";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface DownloadStats {
  sdk: number;
  ui: number;
  total: number;
}

export interface StatsResponse {
  [itemName: string]: DownloadStats;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  currentValue: number;
  mintedAt: string;
  lastSyncedAt: string;
  openseaUrl: string;
  attributes: NFTAttribute[];
}

export interface UserUpload {
  id: string;
  name: string;
  description: string;
  type: "model" | "dataset";
  author: string;
  uploadedAt: string;
  fileSize: string;
  license: string;
  tags: string[];
  downloads: DownloadStats;
  likes: number;
  views: number;
  forks: number;
  stars: number;
  comments: number;
  nft: NFTMetadata;
}

export interface PortfolioStats {
  totalUploads: number;
  totalDownloads: number;
  totalNFTValue: number;
  totalEngagement: number;
}

export interface EngagementMetrics {
  downloads: number;
  likes: number;
  views: number;
  forks: number;
  comments: number;
  stars: number;
}

export interface SyncResult {
  success: boolean;
  newValue: number;
  transactionHash: string;
  error?: string;
}

// API Functions
export class DeHugAPI {
  // Track download
  static async trackDownload(
    itemName: string,
    source: "sdk" | "ui"
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("item_name", itemName);
      formData.append("source", source);

      await apiClient.post("/track/download", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.warn("Error tracking download:", error);
      // Graceful fallback - don't break the download flow
    }
  }

  // Get download stats
  static async getDownloadStats(): Promise<Record<string, DownloadStats>> {
    try {
      const response = await apiClient.get("/track/stats");
      return response.data;
    } catch (error) {
      console.warn("Error fetching download stats:", error);
      return {};
    }
  }

  static async getItemStats(itemName: string): Promise<DownloadStats | null> {
    try {
      const allStats = await this.getDownloadStats();
      return allStats[itemName] || null;
    } catch (error) {
      console.error("Failed to fetch item stats:", error);
      return null;
    }
  }

  // Download from Filecoin/IPFS
  static async downloadFromFilecoin(
    itemName: string,
    ipfsHash: string,
    source: "sdk" | "ui" = "ui"
  ): Promise<string> {
    try {
      // Track the download
      await this.trackDownload(itemName, source);

      // Return IPFS gateway URL using the provided ipfsHash
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.warn("Error downloading from Filecoin:", error);
      throw error;
    }
  }

  // Get user uploads (mock data)
  static async getUserUploads(): Promise<UserUpload[]> {
    try {
      // Mock data for development
      return [
        {
          id: "1",
          name: "African Language Model v2.1",
          description:
            "Advanced multilingual model trained on 15 African languages including Swahili, Yoruba, Amharic, and Zulu.",
          type: "model",
          author: "Dr. Amara Okafor",
          uploadedAt: "2024-01-15T10:30:00Z",
          fileSize: "2.3 GB",
          license: "Apache 2.0",
          tags: ["nlp", "multilingual", "african-languages", "transformer"],
          downloads: { sdk: 1247, ui: 856, total: 2103 },
          likes: 342,
          views: 5678,
          forks: 89,
          stars: 234,
          comments: 67,
          nft: {
            tokenId: "1001",
            name: "African Language Model NFT",
            description:
              "Represents ownership and contribution to African NLP advancement",
            image: "/african-ai-nft.png",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            currentValue: 0.847,
            mintedAt: "2024-01-15T10:30:00Z",
            lastSyncedAt: "2024-01-20T14:22:00Z",
            openseaUrl:
              "https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4/1001",
            attributes: [
              { trait_type: "Rarity", value: "Epic" },
              { trait_type: "Language Count", value: 15 },
              { trait_type: "Model Size", value: "2.3B" },
              { trait_type: "Training Data", value: "Curated" },
            ],
          },
        },
        {
          id: "2",
          name: "Swahili Speech Dataset",
          description:
            "Comprehensive speech dataset with 10,000 hours of native Swahili speakers from Kenya, Tanzania, and Uganda.",
          type: "dataset",
          author: "Prof. Kesi Mwangi",
          uploadedAt: "2024-01-10T08:15:00Z",
          fileSize: "45.7 GB",
          license: "CC BY-SA 4.0",
          tags: ["speech", "swahili", "audio", "east-africa"],
          downloads: { sdk: 892, ui: 1205, total: 2097 },
          likes: 278,
          views: 4321,
          forks: 156,
          stars: 189,
          comments: 43,
          nft: {
            tokenId: "1002",
            name: "Swahili Speech Collection NFT",
            description: "Preserving and promoting Swahili language through AI",
            image: "/swahili-dataset-nft.png",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            currentValue: 0.623,
            mintedAt: "2024-01-10T08:15:00Z",
            lastSyncedAt: "2024-01-19T16:45:00Z",
            openseaUrl:
              "https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4/1002",
            attributes: [
              { trait_type: "Rarity", value: "Rare" },
              { trait_type: "Hours", value: 10000 },
              { trait_type: "Speakers", value: "Native" },
              { trait_type: "Quality", value: "Studio" },
            ],
          },
        },
        {
          id: "3",
          name: "Yoruba Text Classification Model",
          description:
            "Fine-tuned BERT model for Yoruba text classification tasks including sentiment analysis and topic modeling.",
          type: "model",
          author: "Dr. Folake Adebayo",
          uploadedAt: "2024-01-08T12:45:00Z",
          fileSize: "1.8 GB",
          license: "MIT",
          tags: ["bert", "yoruba", "classification", "sentiment"],
          downloads: { sdk: 567, ui: 423, total: 990 },
          likes: 156,
          views: 2890,
          forks: 34,
          stars: 98,
          comments: 28,
          nft: {
            tokenId: "1003",
            name: "Yoruba AI Model NFT",
            description: "Advancing Yoruba language processing with modern AI",
            image: "/yoruba-speech-nft.png",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            currentValue: 0.412,
            mintedAt: "2024-01-08T12:45:00Z",
            lastSyncedAt: "2024-01-18T09:30:00Z",
            openseaUrl:
              "https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4/1003",
            attributes: [
              { trait_type: "Rarity", value: "Common" },
              { trait_type: "Base Model", value: "BERT" },
              { trait_type: "Task", value: "Classification" },
              { trait_type: "Accuracy", value: "94.2%" },
            ],
          },
        },
      ];
    } catch (error) {
      console.warn("Error fetching user uploads:", error);
      return [];
    }
  }

  // Get portfolio stats
  static async getPortfolioStats(): Promise<PortfolioStats> {
    try {
      const uploads = await this.getUserUploads();

      return {
        totalUploads: uploads.length,
        totalDownloads: uploads.reduce(
          (sum, upload) => sum + upload.downloads.total,
          0
        ),
        totalNFTValue: uploads.reduce(
          (sum, upload) => sum + upload.nft.currentValue,
          0
        ),
        totalEngagement: uploads.reduce(
          (sum, upload) =>
            sum +
            upload.likes +
            upload.views +
            upload.forks +
            upload.stars +
            upload.comments,
          0
        ),
      };
    } catch (error) {
      console.warn("Error calculating portfolio stats:", error);
      return {
        totalUploads: 0,
        totalDownloads: 0,
        totalNFTValue: 0,
        totalEngagement: 0,
      };
    }
  }

  // Sync NFT engagement to smart contract
  static async syncNFTEngagement(upload: UserUpload): Promise<SyncResult> {
    try {
      // Mock smart contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Calculate new NFT value based on engagement
      const engagementScore =
        upload.downloads.total * 10 +
        upload.likes * 5 +
        upload.views * 1 +
        upload.forks * 20 +
        upload.stars * 8 +
        upload.comments * 3;

      // Convert engagement to ETH value (mock calculation)
      const baseValue = 0.1;
      const engagementMultiplier = Math.log(engagementScore + 1) / 10;
      const newValue = baseValue + engagementMultiplier;

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Simulate 90% success rate
      const success = Math.random() > 0.1;

      if (success) {
        return {
          success: true,
          newValue: Math.max(newValue, upload.nft.currentValue * 1.01), // Ensure some growth
          transactionHash: txHash,
        };
      } else {
        return {
          success: false,
          newValue: upload.nft.currentValue,
          transactionHash: "",
          error: "Smart contract execution failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        newValue: upload.nft.currentValue,
        transactionHash: "",
        error: "Network error during sync",
      };
    }
  }
}