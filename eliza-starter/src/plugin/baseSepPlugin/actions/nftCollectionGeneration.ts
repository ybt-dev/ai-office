import {
  type Action,
  composeContext,
  elizaLogger,
  generateObject,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
} from "@elizaos/core";
import { createCollectionMetadata } from "../handlers/createCollection.ts";
import { CreateCollectionSchema } from "../types/index.ts";
import { createCollectionTemplate } from "../templates/index.ts";
import * as viemChains from "viem/chains";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  compileContract,
  deployContract,
  encodeConstructorArguments,
  generateERC721ContractCode,
} from "../utils/deployEVMContract.ts";
import { verifyEVMContract } from "../utils/verifyEVMContract.ts";

const nftCollectionGeneration: Action = {
  name: "GENERATE_COLLECTION",
  similes: [
    "COLLECTION_GENERATION",
    "COLLECTION_GEN",
    "CREATE_COLLECTION",
    "MAKE_COLLECTION",
    "GENERATE_COLLECTION",
  ],
  description: "Generate an NFT collection on Base Sepolia",
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    const awsAccessKeyIdOk = !!runtime.getSetting("AWS_ACCESS_KEY_ID");
    const awsSecretAccessKeyOk = !!runtime.getSetting("AWS_SECRET_ACCESS_KEY");
    const awsRegionOk = !!runtime.getSetting("AWS_REGION");
    const awsS3BucketOk = !!runtime.getSetting("AWS_S3_BUCKET");
    const evmPrivateKeyOk = !!runtime.getSetting("EVM_PRIVATE_KEY");

    return (
      awsAccessKeyIdOk &&
      awsSecretAccessKeyOk &&
      awsRegionOk &&
      awsS3BucketOk &&
      evmPrivateKeyOk
    );
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ) => {
    try {
      elizaLogger.log("Composing state for message:", message);
      const state = await runtime.composeState(message);

      // Generate collection metadata
      const collectionInfo = await createCollectionMetadata({
        runtime,
        collectionName: runtime.character.name,
        fee: 0, // No royalty fees
      });

      if (!collectionInfo) {
        throw new Error("Failed to generate collection metadata");
      }

      // Setup Base Sepolia connection
      const privateKey = runtime.getSetting("EVM_PRIVATE_KEY") as `0x${string}`;
      if (!privateKey) {
        throw new Error("EVM private key not found");
      }

      const chain = viemChains.baseSepolia;
      const provider = http(chain.rpcUrls.default.http[0]);
      const account = privateKeyToAccount(privateKey);

      const walletClient = createWalletClient({
        account,
        chain,
        transport: provider,
      });

      const publicClient = createPublicClient({
        chain,
        transport: provider,
      });

      // Generate and deploy contract
      const contractName = runtime.character.name.replace(/[^a-zA-Z0-9]/g, "_");
      const sourceCode = generateERC721ContractCode(contractName);
      const { abi, bytecode, metadata } = compileContract(
        contractName,
        sourceCode
      );
      elizaLogger.log("Contract compiled successfully");

      const params = [
        collectionInfo.name,
        collectionInfo.symbol,
        collectionInfo.maxSupply,
        collectionInfo.fee,
      ];

      const contractAddress = await deployContract({
        walletClient,
        publicClient,
        abi,
        bytecode,
        args: params,
      });
      elizaLogger.log(`Contract deployed at: ${contractAddress}`);

      // Verify contract on Base Sepolia explorer
      const constructorArgs = encodeConstructorArguments(abi, params);
      await verifyEVMContract({
        contractAddress,
        sourceCode,
        metadata,
        constructorArgs,
        apiEndpoint: `${chain.blockExplorers.default.url}/api`,
      });
      elizaLogger.log("Contract verified successfully");

      if (callback) {
        callback({
          text: `Collection created successfully! 🎉\nView on Base Sepolia: ${chain.blockExplorers.default.url}/address/${contractAddress}\nContract Address: ${contractAddress}`,
          attachments: [],
        });
      }

      return [];
    } catch (e: any) {
      elizaLogger.error("Error generating collection:", e);
      throw e;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "Generate a collection on Base" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Here's your new NFT collection on Base Sepolia.",
          action: "GENERATE_COLLECTION",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "Create a collection on Base Sepolia" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Your collection has been created on Base Sepolia.",
          action: "GENERATE_COLLECTION",
        },
      },
    ],
  ],
};

export default nftCollectionGeneration;
