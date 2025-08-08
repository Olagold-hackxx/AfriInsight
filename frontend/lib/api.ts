import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface DownloadStats {
  sdk: number;
  ui: number;
  total: number;
}

export interface StatsResponse {
  [itemName: string]: DownloadStats;
}

export class DeHugAPI {
  static async trackDownload(
    itemName: string,
    source: "ui" | "sdk"
  ): Promise<void> {
    try {
      const payload = {
        item_name: itemName,
        source: source,
      };

      const response = await axios.post(
        `${API_BASE_URL}/track/download`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to track download:", error);
      // Don't throw error to avoid breaking the download flow
    }
  }

  static async getStats(): Promise<StatsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/track/stats`);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      return {};
    }
  }

  static async getItemStats(itemName: string): Promise<DownloadStats | null> {
    try {
      const allStats = await this.getStats();
      return allStats[itemName] || null;
    } catch (error) {
      console.error("Failed to fetch item stats:", error);
      return null;
    }
  }

  // Simulate IPFS/Filecoin download with tracking
  static async downloadFromFilecoin(
    itemName: string,
    ipfsHash: string,
    source: "ui" | "sdk" = "ui"
  ): Promise<void> {
    try {
      // Track the download first
      await this.trackDownload(itemName, source);

      // Simulate download from Filecoin/IPFS
      // In a real implementation, this would fetch from IPFS gateway
      const downloadUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

      // Create a temporary link to trigger download
      // const link = document.createElement('a')
      // link.href = downloadUrl
      // link.download = itemName
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)

      console.log(`Download initiated for ${itemName} from ${downloadUrl}`);
    } catch (error) {
      console.error("Download failed:", error);
      throw error;
    }
  }
}