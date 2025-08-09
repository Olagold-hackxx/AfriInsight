"use client";

import { useCallback } from "react";
import { toast } from 'react-toastify';
import { useChainId, useAccount } from "../../lib/thirdweb-hooks";
import { useRouter } from "next/navigation";
import { useChainSwitch } from "../useChainSwitch";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
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

const useUploadContent = () => {
    const chainId = useChainId();
    const account = useActiveAccount();
    const { isConnected } = useAccount();
    const router = useRouter();
    const { ensureCorrectChain } = useChainSwitch();

    return useCallback(
        async (params: UploadContentParams) => {
            if (!account) {
                toast.warning("Please connect your wallet first.");
                return false;
            }

            if (!isConnected) {
                toast.warning("Please connect your wallet first.");
                return false;
            }
            
            const isCorrectChain = await ensureCorrectChain();
            if (!isCorrectChain) {
                return false;
            }

            // Validate required parameters
            if (!params.ipfsHash || !params.metadataIPFSHash || !params.title) {
                toast.error("Please fill in all required fields.");
                return false;
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
                    method: "function uploadContent(uint8 _contentType, string memory _ipfsHash, string memory _metadataIPFSHash, string memory _imageIPFSHash, string memory _title, string memory _description, string[] memory _tags) returns (uint256)",
                    params: [
                        params.contentType,
                        params.ipfsHash,
                        params.metadataIPFSHash,
                        params.imageIPFSHash,
                        params.title,
                        params.description,
                        params.tags
                    ],
                });

                toast.info("Please wait while we upload your content to the blockchain.");

                // Send the transaction
                const result = await sendTransaction({
                    transaction,
                    account,
                });

                toast.success("Content uploaded successfully!");
                
                // You can return the transaction result if needed
                return {
                    success: true,
                    transactionHash: result.transactionHash,
                };
                
            } catch (error) {
                const err = error as ErrorWithReason;
                let errorMessage = "An error occurred while uploading content.";
                
                // Handle specific error cases based on your contract requirements
                if (err.reason === "IPFS hash cannot be empty") {
                    errorMessage = "IPFS hash is required.";
                } else if (err.reason === "Content already exists") {
                    errorMessage = "This content has already been uploaded.";
                } else if (err.reason === "Title cannot be empty") {
                    errorMessage = "Title is required.";
                } else if (err.reason === "Metadata IPFS hash cannot be empty") {
                    errorMessage = "Metadata IPFS hash is required.";
                }
                
                toast.error(errorMessage);
                console.error("Upload content error:", error);
                return false;
            }
        },
        [chainId, isConnected, account, ensureCorrectChain]
    );
};

export default useUploadContent;