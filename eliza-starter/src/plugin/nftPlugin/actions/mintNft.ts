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
import { mintNFTTemplate } from "../../baseSepPlugin/templates/index.ts";
import {
  type MintNFTContent,
  MintNFTSchema,
} from "../../baseSepPlugin/types/index.ts";
import * as viemChains from "viem/chains";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

function isMintNFTContent(content: any): content is MintNFTContent {
  return typeof content.collectionAddress === "string";
}

const mintNFTAction: Action = {
  name: "MINT_NFT",
  similes: [
    "NFT_MINTING",
    "NFT_CREATION",
    "CREATE_NFT",
    "GENERATE_NFT",
    "MINT_TOKEN",
    "CREATE_TOKEN",
    "MAKE_NFT",
    "TOKEN_GENERATION",
  ],
  description: "Mint NFTs for the collection on Base Sepolia",
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    return !!runtime.getSetting("EVM_PRIVATE_KEY");
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback: HandlerCallback
  ) => {
    try {
      elizaLogger.log("Composing state for message:", message);

      let currentState: State;
      if (!state) {
        currentState = (await runtime.composeState(message)) as State;
      } else {
        currentState = await runtime.updateRecentMessageState(state);
      }

      const context = composeContext({
        state: currentState,
        template: mintNFTTemplate,
      });

      const res = await generateObject({
        runtime,
        context,
        modelClass: ModelClass.LARGE,
        schema: MintNFTSchema,
      });

      const content = res.object as MintNFTContent;
      elizaLogger.log("Generate Object:", content);

      if (!isMintNFTContent(content)) {
        elizaLogger.error("Invalid content for MINT_NFT action.");
        if (callback) {
          callback({
            text: "Unable to process mint request. Invalid content provided.",
            content: { error: "Invalid mint content" },
          });
        }
        return false;
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

      // Mint NFT
      const mintTx = await walletClient.writeContract({
        address: content.collectionAddress as `0x${string}`,
        abi: [
          {
            inputs: [{ internalType: "address", name: "_to", type: "address" }],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "mint",
        args: [account.address],
        chain: chain,
        account: account,
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: mintTx,
      });

      if (receipt.status === "success") {
        if (callback) {
          callback({
            text: `NFT minted successfully! 🎉\nCollection Address: ${content.collectionAddress}\nTransaction: ${chain.blockExplorers.default.url}/tx/${mintTx}`,
            attachments: [],
          });
        }
      } else {
        throw new Error("Transaction failed");
      }

      return true;
    } catch (e: unknown) {
      elizaLogger.error("Error minting NFT:", e);
      throw e;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "mint nft for collection: 0x1234... on Base",
        },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "I've minted a new NFT in your specified collection on Base Sepolia.",
          action: "MINT_NFT",
        },
      },
    ],
  ],
} as Action;

export default mintNFTAction;
