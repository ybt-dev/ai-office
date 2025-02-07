import { ethers } from "ethers";
import { Service, ServiceType } from "@elizaos/core";

export interface INFTService {
  deployCollection(
    name: string,
    symbol: string,
    baseURI: string
  ): Promise<string>;
  mintNFT(
    collectionAddress: string,
    to: string,
    tokenURI: string
  ): Promise<string>;
  getCollectionInfo(collectionAddress: string): Promise<{
    name: string;
    symbol: string;
    totalSupply: number;
  }>;
}

export class NFTService implements Service, INFTService {
  readonly serviceType: ServiceType = ServiceType.TEXT_GENERATION;
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly signer: ethers.Signer;

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: ethers.Signer
  ) {
    this.provider = provider;
    this.signer = signer;
  }

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async deployCollection(
    name: string,
    symbol: string,
    baseURI: string
  ): Promise<string> {
    const nftFactory = new ethers.ContractFactory(
      NFT_ABI,
      NFT_BYTECODE,
      this.signer
    );

    const nftContract = await nftFactory.deploy(name, symbol, baseURI);
    await nftContract.deployed();

    return nftContract.address;
  }

  async mintNFT(
    collectionAddress: string,
    to: string,
    tokenURI: string
  ): Promise<string> {
    const nftContract = new ethers.Contract(
      collectionAddress,
      NFT_ABI,
      this.signer
    );

    const tx = await nftContract.mint(to, tokenURI);
    const receipt = await tx.wait();

    return receipt.transactionHash;
  }

  async getCollectionInfo(
    collectionAddress: string
  ): Promise<{ name: string; symbol: string; totalSupply: number }> {
    const nftContract = new ethers.Contract(
      collectionAddress,
      NFT_ABI,
      this.provider
    );

    const [name, symbol, totalSupply] = await Promise.all([
      nftContract.name(),
      nftContract.symbol(),
      nftContract.totalSupply(),
    ]);

    return {
      name,
      symbol,
      totalSupply: totalSupply.toNumber(),
    };
  }
}

const NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function mint(address to, string memory tokenURI) returns (uint256)",
];

const NFT_BYTECODE = "0x..."; // Add your NFT contract bytecode here
