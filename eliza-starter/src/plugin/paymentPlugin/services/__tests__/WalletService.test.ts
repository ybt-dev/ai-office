import { ethers } from "ethers";
import CryptoJS from "crypto-js";

describe("Wallet Service Functions", () => {
  const encryptionKey = "test-encryption-key";
  let wallet:
    | { address: string; privateKey: string; seedPhrase: string }
    | undefined;

  // Helper function to create wallet
  async function createWallet() {
    const newWallet = ethers.Wallet.createRandom();
    return {
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      seedPhrase: newWallet.mnemonic.phrase,
    };
  }

  // Helper function to get wallet address
  function getWalletAddress(): string {
    if (!wallet) {
      throw new Error("Wallet not initialized");
    }
    return wallet.address;
  }

  // Helper functions for encryption/decryption
  async function encryptSeedPhrase(seedPhrase: string): Promise<string> {
    return CryptoJS.AES.encrypt(seedPhrase, encryptionKey).toString();
  }

  async function decryptSeedPhrase(encryptedSeed: string): Promise<string> {
    const bytes = CryptoJS.AES.decrypt(encryptedSeed, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  it("should create wallet with valid properties", async () => {
    const newWallet = await createWallet();
    console.log("Created wallet details:");
    console.log("Address:", newWallet.address);
    console.log("Private key:", newWallet.privateKey);
    console.log("Seed phrase:", newWallet.seedPhrase);

    expect(newWallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(newWallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(newWallet.seedPhrase.split(" ").length).toBe(12);
  });

  it("should throw error when getting wallet address before initialization", () => {
    expect(() => getWalletAddress()).toThrow("Wallet not initialized");
  });

  it("should return wallet address after initialization", async () => {
    wallet = await createWallet();
    const address = getWalletAddress();
    console.log("Initialized wallet address:", address);
    expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("should encrypt and decrypt seed phrase correctly", async () => {
    const originalSeedPhrase = "test seed phrase for encryption";

    // Encrypt
    const encrypted = await encryptSeedPhrase(originalSeedPhrase);
    console.log("Encrypted seed phrase:", encrypted);
    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toBe(originalSeedPhrase);

    // Decrypt
    const decrypted = await decryptSeedPhrase(encrypted);
    console.log("Decrypted seed phrase:", decrypted);
    expect(decrypted).toBe(originalSeedPhrase);
  });

  it("should create unique wallets each time", async () => {
    const wallet1 = await createWallet();
    const wallet2 = await createWallet();

    console.log("Wallet 1:", wallet1.address);
    console.log("Wallet 2:", wallet2.address);

    expect(wallet1.address).not.toBe(wallet2.address);
    expect(wallet1.privateKey).not.toBe(wallet2.privateKey);
    expect(wallet1.seedPhrase).not.toBe(wallet2.seedPhrase);
  });
});
