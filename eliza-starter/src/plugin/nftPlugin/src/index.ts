export * from "../../nftPlugin/actions/mintNft.ts";
export * from "../../nftPlugin/actions/mintNft.ts";
export * from "../providers/wallet.ts";
export * from "../types/index.ts";

import type { Plugin } from "@elizaos/core";
import { evmWalletProvider } from "../providers/wallet.ts";
import nftCollectionGeneration from "../../nftPlugin/actions/nftCollectionGeneration.ts";
import mintNFTAction from "../../nftPlugin/actions/mintNft.ts";

export const nftPlugin: Plugin = {
  name: "nft",
  description: "NFT plugin",
  providers: [evmWalletProvider],
  evaluators: [],
  services: [],
  actions: [nftCollectionGeneration, mintNFTAction],
};

export default nftPlugin;
