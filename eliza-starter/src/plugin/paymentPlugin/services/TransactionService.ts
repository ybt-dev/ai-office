import { Service, ServiceType } from "@elizaos/core";
import { ethers } from "ethers";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ITransactionService {
  initialize(): Promise<void>;
  transfer(from: string, to: string, amount: string): Promise<string>;
  getTransactionStatus(txHash: string): Promise<TransactionStatus>;
  getBalance(address: string): Promise<string>;
  subscribeToTransfers(
    callback: (from: string, to: string, amount: string) => void
  ): void;
}

export class TransactionService implements Service, ITransactionService {
  readonly serviceType: ServiceType = ServiceType.TEXT_GENERATION;
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly usdcContract: ethers.Contract;
  private readonly USDC_CONTRACT = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider;
    this.usdcContract = new ethers.Contract(
      this.USDC_CONTRACT,
      [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function balanceOf(address account) view returns (uint256)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ],
      provider
    );
  }

  async initialize(): Promise<void> {
    try {
      await this.provider.getNetwork();
    } catch (error) {
      throw new Error(
        `Failed to initialize TransactionService: ${error.message}`
      );
    }
  }

  async transfer(from: string, to: string, amount: string): Promise<string> {
    const signer = this.provider.getSigner(from);
    const contractWithSigner = this.usdcContract.connect(signer);
    const tx = await contractWithSigner.transfer(to, amount);
    return tx.hash;
  }

  async getTransactionStatus(txHash: string): Promise<TransactionStatus> {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    return receipt ? (receipt.status === 1 ? "SUCCESS" : "FAILED") : "PENDING";
  }

  async getBalance(address: string): Promise<string> {
    return await this.usdcContract.balanceOf(address);
  }

  subscribeToTransfers(
    callback: (from: string, to: string, amount: string) => void
  ): void {
    this.usdcContract.on("Transfer", (from, to, amount) => {
      callback(from, to, amount.toString());
    });
  }
}
