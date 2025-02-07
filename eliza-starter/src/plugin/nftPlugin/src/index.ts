import { Plugin } from "@elizaos/core";
import { NFTService } from "../services/NFTService";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nftService = new NFTService(provider, signer);

export const nftPlugin: Plugin = {
  name: "nft",
  description: "NFT deployment and minting functionality plugin",
  actions: [], // Add NFT related actions here
  evaluators: [], // Add NFT related evaluators here
  providers: [], // Add NFT related providers here
  services: [nftService],
};

export default nftPlugin;
