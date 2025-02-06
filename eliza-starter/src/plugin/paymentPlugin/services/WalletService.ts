import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import { Service, ServiceType } from "@elizaos/core";
import { ITransactionService } from "./TransactionService.ts";

export interface IWalletService {
  initialize(): Promise<void>;
  createWallet(): Promise<{
    address: string;
    privateKey: string;
    seedPhrase: string;
  }>;
  encryptSeedPhrase(seedPhrase: string): Promise<string>;
  decryptSeedPhrase(encryptedSeed: string): Promise<string>;
  getBalance(address: string): Promise<string>;
  getWalletAddress(): string;
}

export class WalletService implements Service, IWalletService {
  readonly serviceType: ServiceType = ServiceType.TEXT_GENERATION;
  private readonly encryptionKey: string;
  private wallet?: {
    address: string;
    privateKey: string;
    seedPhrase: string;
  };

  constructor(
    encryptionKey: string,
    private readonly transactionService: ITransactionService
  ) {
    this.encryptionKey = encryptionKey;
  }

  async initialize(): Promise<void> {
    this.wallet = await this.createWallet();
    console.log(`Wallet initialized with address: ${this.wallet.address}`);
  }

  getWalletAddress(): string {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    return this.wallet.address;
  }

  async createWallet() {
    const wallet = ethers.Wallet.createRandom();

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedPhrase: wallet.mnemonic.phrase,
    };
  }

  async encryptSeedPhrase(seedPhrase: string): Promise<string> {
    return CryptoJS.AES.encrypt(seedPhrase, this.encryptionKey).toString();
  }

  async decryptSeedPhrase(encryptedSeed: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedSeed, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  async getBalance(address: string): Promise<string> {
    return this.transactionService.getBalance(address);
  }
}
