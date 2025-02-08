export * from "../actions/transfer.ts";
export * from "../actions/mintNft.ts";
export * from "../actions/mintNft.ts";
export * from "../providers/wallet.ts";
export * from "../types/index.ts";

import type { Plugin } from "@elizaos/core";
import { transferAction } from "../actions/transfer.ts";
import { evmWalletProvider } from "../providers/wallet.ts";
import nftCollectionGeneration from "../actions/nftCollectionGeneration.ts";
import mintNFTAction from "../actions/mintNFT.ts";

export const baseSepPlugin: Plugin = {
  name: "baseSep",
  description: "Base Sepolia EVM blockchain integration plugin",
  providers: [evmWalletProvider],
  evaluators: [],
  services: [],
  actions: [transferAction, nftCollectionGeneration, mintNFTAction],
};

export default baseSepPlugin;
