"use client";

import { useCallback } from "react";
import { toast } from 'react-toastify';
import { useChainId, useAccount } from "../../lib/thirdweb-hooks";
import { useRouter } from "next/navigation";
import { useChainSwitch } from "../useChainSwitch";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction, waitForReceipt, getContractEvents, prepareEvent, readContract } from "thirdweb";
import { thirdwebClient } from "@/app/client";
import { filecoinCalibrationTestnet } from "@/constants/chain";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

interface UploadContentParams {
  contentType: 0 | 1; // 0 for DATASET, 1 for MODEL
  ipfsHash: string;
  metadataIPFSHash: string;
  imageIPFSHash: string;
  title: string;
  description: string;
  tags: string[];
}

interface UploadContentResult {
  success: boolean;
  transactionHash?: `0x${string}`;
  tokenId?: string;
}

const useUploadContent = () => {
  const chainId = useChainId();
  const account = useActiveAccount();
  const { isConnected } = useAccount();
  const router = useRouter();
  const { ensureCorrectChain } = useChainSwitch();

  return useCallback(
    async (params: UploadContentParams): Promise<UploadContentResult> => {
      if (!account) {
        toast.warning("Please connect your wallet first.");
        return { success: false };
      }

      if (!isConnected) {
        toast.warning("Please connect your wallet first.");
        return { success: false };
      }

      const isCorrectChain = await ensureCorrectChain();
      if (!isCorrectChain) {
        return { success: false };
      }

      // Validate required parameters
      if (!params.ipfsHash || !params.metadataIPFSHash || !params.title) {
        toast.error("Please fill in all required fields.");
        return { success: false };
      }

      try {
        // Get the contract instance using thirdweb
        const contract = getContract({
          client: thirdwebClient,
          chain: filecoinCalibrationTestnet,
          address: process.env.DEHUG_ADDRESS as string,
        });

        // Prepare the contract call for uploadContent
        const transaction = prepareContractCall({
          contract,
          method: "function uploadContent(uint8 _contentType, string _ipfsHash, string _metadataIPFSHash, string _imageIPFSHash, string _title, string _description, string[] _tags) returns (uint256)",
          params: [
            params.contentType,
            params.ipfsHash,
            params.metadataIPFSHash,
            params.imageIPFSHash,
            params.title,
            params.description,
            params.tags,
          ],
        });

        toast.info("Please wait while we upload your content to the blockchain.");

        // Send the transaction
        const result = await sendTransaction({
          transaction,
          account,
        });

        // Wait for the transaction receipt to ensure it's mined
        const receipt = await waitForReceipt({
          client: thirdwebClient,
          chain: filecoinCalibrationTestnet,
          transactionHash: result.transactionHash,
        });

        // Prepare the ContentUploaded event
        const contentUploadedEvent = prepareEvent({
          signature: "event ContentUploaded(uint256 indexed tokenId, address indexed uploader, uint8 contentType, string ipfsHash, string title)",
        });

        // Fetch the ContentUploaded event
        const events = await getContractEvents({
          contract,
          events: [contentUploadedEvent],
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber,
        });

        let tokenId: string | null = null;
        for (const event of events) {
          if (event.eventName === "ContentUploaded") {
            tokenId = event.args.tokenId.toString();
            break;
          }
        }

        if (!tokenId) {
          throw new Error("Failed to retrieve token ID from ContentUploaded event");
        }

        // Verify the tokenId using ipfsHashToTokenId mapping with retries
        let mappingTokenId: string | null = null;
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
          try {
            const result = await readContract({
              contract,
              method: "function ipfsHashToTokenId(string) view returns (uint256)",
              params: [params.ipfsHash],
            });
            mappingTokenId = result.toString();
            if (mappingTokenId !== "0") {
              break;
            }
          } catch (error) {
            console.warn(`Retry ${retryCount + 1}: Failed to read ipfsHashToTokenId`, error);
          }
          retryCount++;
          if (retryCount < maxRetries) {
            // Wait 2 seconds before retrying
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        if (!mappingTokenId || mappingTokenId === "0") {
          console.warn("ipfsHashToTokenId mapping returned 0, relying on event tokenId");
        } else if (mappingTokenId !== tokenId) {
          throw new Error("Token ID mismatch between event and ipfsHashToTokenId mapping");
        }

        toast.success("Content uploaded successfully!");

        return {
          success: true,
          transactionHash: result.transactionHash as `0x${string}`,
          tokenId,
        };
      } catch (error) {
        const err = error as ErrorWithReason;
        let errorMessage = "An error occurred while uploading content.";

        if (err.reason === "IPFS hash cannot be empty") {
          errorMessage = "IPFS hash is required.";
        } else if (err.reason === "Content already exists") {
          errorMessage = "This content has already been uploaded.";
        } else if (err.reason === "Title cannot be empty") {
          errorMessage = "Title is required.";
        } else if (err.reason === "Metadata IPFS hash cannot be empty") {
          errorMessage = "Metadata IPFS hash is required.";
        } else if (err.message?.includes("Failed to retrieve token ID")) {
          errorMessage = "Failed to retrieve token ID from transaction.";
        }

        toast.error(errorMessage);
        console.error("Upload content error:", error);
        return { success: false };
      }
    },
    [chainId, isConnected, account, ensureCorrectChain]
  );
};

export default useUploadContent;