import { ethers } from "ethers";
import { Service, ServiceType } from "@elizaos/core";

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

  constructor(provider: ethers.providers.JsonRpcProvider) {
    this.provider = provider;
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
    const tx = await signer.sendTransaction({
      to: to,
      value: ethers.utils.parseEther(amount),
    });
    return tx.hash;
  }

  async getTransactionStatus(txHash: string): Promise<TransactionStatus> {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    return receipt ? (receipt.status === 1 ? "SUCCESS" : "FAILED") : "PENDING";
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  subscribeToTransfers(
    callback: (from: string, to: string, amount: string) => void
  ): void {
    this.provider.on("block", async (blockNumber) => {
      const block = await this.provider.getBlockWithTransactions(blockNumber);
      block.transactions.forEach((tx) => {
        if (tx.value.gt(0)) {
          callback(tx.from, tx.to, ethers.utils.formatEther(tx.value));
        }
      });
    });
  }
}
