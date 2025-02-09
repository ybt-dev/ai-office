import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  formatUnits,
  http,
  publicActions,
  walletActions,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import {
  type IAgentRuntime,
  type Provider,
  type Memory,
  type State,
  type ICacheManager,
  elizaLogger,
} from "@elizaos/core";
import type {
  Address,
  WalletClient,
  PublicClient,
  Chain,
  HttpTransport,
  Account,
  PrivateKeyAccount,
  TestClient,
} from "viem";
import * as viemChains from "viem/chains";
import { DeriveKeyProvider, TEEMode } from "@elizaos/plugin-tee";
import NodeCache from "node-cache";
import * as path from "node:path";
import pkg from "crypto-js";

import type { SupportedChain } from "../types/index.ts";

export class WalletProvider {
  private cache: NodeCache;
  private cacheKey = "evm/wallet";
  private currentChain: SupportedChain = "baseSepolia";
  private CACHE_EXPIRY_SEC = 5;
  chains: Record<string, Chain> = { ...viemChains };
  account: PrivateKeyAccount;

  constructor(
    accountOrPrivateKey: PrivateKeyAccount | `0x${string}`,
    private cacheManager: ICacheManager,
    chains?: Record<string, Chain>
  ) {
    this.setAccount(accountOrPrivateKey);
    this.setChains(chains);

    if (chains && Object.keys(chains).length > 0) {
      this.setCurrentChain(Object.keys(chains)[0] as SupportedChain);
    }

    this.cache = new NodeCache({ stdTTL: this.CACHE_EXPIRY_SEC });
  }

  getAddress(): Address {
    return this.account.address;
  }

  getCurrentChain(): Chain {
    return this.chains[this.currentChain];
  }

  getPublicClient(
    chainName: SupportedChain
  ): PublicClient<HttpTransport, Chain, Account | undefined> {
    const transport = this.createHttpTransport(chainName);

    const publicClient = createPublicClient({
      chain: this.chains[chainName],
      transport,
    });
    return publicClient;
  }

  getWalletClient(chainName: SupportedChain): WalletClient {
    const transport = this.createHttpTransport(chainName);

    const walletClient = createWalletClient({
      chain: this.chains[chainName],
      transport,
      account: this.account,
    });

    return walletClient;
  }

  getTestClient(): TestClient {
    return createTestClient({
      chain: viemChains.hardhat,
      mode: "hardhat",
      transport: http(),
    })
      .extend(publicActions)
      .extend(walletActions);
  }

  getChainConfigs(chainName: SupportedChain): Chain {
    const chain = viemChains[chainName];

    if (!chain?.id) {
      throw new Error("Invalid chain name");
    }

    return chain;
  }

  async getWalletBalance(): Promise<string | null> {
    const cacheKey = `walletBalance_${this.currentChain}`;
    const cachedData = await this.getCachedData<string>(cacheKey);
    if (cachedData) {
      elizaLogger.log(
        `Returning cached wallet balance for chain: ${this.currentChain}`
      );
      return cachedData;
    }

    try {
      const client = this.getPublicClient(this.currentChain);
      const balance = await client.getBalance({
        address: this.account.address,
      });
      const balanceFormatted = formatUnits(balance, 18);
      this.setCachedData<string>(cacheKey, balanceFormatted);
      elizaLogger.log("Wallet balance cached for chain: ", this.currentChain);
      return balanceFormatted;
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return null;
    }
  }

  async getWalletBalanceForChain(
    chainName: SupportedChain
  ): Promise<string | null> {
    if (chainName !== "baseSepolia") {
      return null;
    }

    try {
      const client = this.getPublicClient(chainName);
      const balance = await client.getBalance({
        address: this.account.address,
      });
      return formatUnits(balance, 18);
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return null;
    }
  }

  addChain(chain: Record<string, Chain>) {
    this.setChains(chain);
  }

  switchChain(chainName: SupportedChain, customRpcUrl?: string) {
    if (!this.chains[chainName]) {
      const chain = WalletProvider.genChainFromName(chainName, customRpcUrl);
      this.addChain({ [chainName]: chain });
    }
    this.setCurrentChain(chainName);
  }

  private async readFromCache<T>(key: string): Promise<T | null> {
    const cached = await this.cacheManager.get<T>(
      path.join(this.cacheKey, key)
    );
    return cached;
  }

  private async writeToCache<T>(key: string, data: T): Promise<void> {
    await this.cacheManager.set(path.join(this.cacheKey, key), data, {
      expires: Date.now() + this.CACHE_EXPIRY_SEC * 1000,
    });
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    // Check in-memory cache first
    const cachedData = this.cache.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    // Check file-based cache
    const fileCachedData = await this.readFromCache<T>(key);
    if (fileCachedData) {
      // Populate in-memory cache
      this.cache.set(key, fileCachedData);
      return fileCachedData;
    }

    return null;
  }

  private async setCachedData<T>(cacheKey: string, data: T): Promise<void> {
    // Set in-memory cache
    this.cache.set(cacheKey, data);

    // Write to file-based cache
    await this.writeToCache(cacheKey, data);
  }

  private setAccount = (
    accountOrPrivateKey: PrivateKeyAccount | `0x${string}`
  ) => {
    if (typeof accountOrPrivateKey === "string") {
      this.account = privateKeyToAccount(accountOrPrivateKey);
    } else {
      this.account = accountOrPrivateKey;
    }
  };

  private setChains = (chains?: Record<string, Chain>) => {
    if (!chains) {
      return;
    }
    for (const chain of Object.keys(chains)) {
      this.chains[chain] = chains[chain];
    }
  };

  private setCurrentChain = (chain: SupportedChain) => {
    this.currentChain = chain;
  };

  private createHttpTransport = (chainName: SupportedChain) => {
    const chain = this.chains[chainName];

    if (chain.rpcUrls.custom) {
      return http(chain.rpcUrls.custom.http[0]);
    }
    return http(chain.rpcUrls.default.http[0]);
  };

  static genChainFromName(
    chainName: string,
    customRpcUrl?: string | null
  ): Chain {
    const baseChain = viemChains[chainName];

    if (!baseChain?.id) {
      throw new Error("Invalid chain name");
    }

    const viemChain: Chain = customRpcUrl
      ? {
          ...baseChain,
          rpcUrls: {
            ...baseChain.rpcUrls,
            custom: {
              http: [customRpcUrl],
            },
          },
        }
      : baseChain;

    return viemChain;
  }
}

const genChainsFromRuntime = (
  runtime: IAgentRuntime
): Record<string, Chain> => {
  const chains: Record<string, Chain> = {};
  const rpcUrl =
    runtime.getSetting("ETHEREUM_PROVIDER_BASE") || "https://sepolia.base.org";

  const baseSepolia: Chain = {
    id: 84532,
    name: "Base Sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "Base Sepolia Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
      public: {
        http: ["https://sepolia.base.org"],
      },
    },
    blockExplorers: {
      default: {
        name: "Base Sepolia Explorer",
        url: "https://sepolia-explorer.base.org",
      },
    },
    testnet: true,
  };

  chains["baseSepolia"] = baseSepolia;
  return chains;
};

const decryptPrivateKey = (encryptedPrivateKey: string): string => {
  const encryptionKey = process.env.WALLET_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error("WALLET_ENCRYPTION_KEY environment variable is not set");
  }

  const { AES, enc } = pkg;
  const bytes = AES.decrypt(encryptedPrivateKey, encryptionKey);
  return bytes.toString(enc.Utf8);
};

export const initWalletProvider = async (runtime: IAgentRuntime) => {
  const teeMode = runtime.getSetting("TEE_MODE") || TEEMode.OFF;
  const chains = genChainsFromRuntime(runtime);

  if (teeMode !== TEEMode.OFF) {
    const walletSecretSalt = runtime.getSetting("WALLET_SECRET_SALT");
    if (!walletSecretSalt) {
      throw new Error("WALLET_SECRET_SALT required when TEE_MODE is enabled");
    }

    const deriveKeyProvider = new DeriveKeyProvider(teeMode);
    const deriveKeyResult = await deriveKeyProvider.deriveEcdsaKeypair(
      walletSecretSalt,
      "evm",
      runtime.agentId
    );
    return new WalletProvider(
      deriveKeyResult.keypair.address,
      runtime.cacheManager,
      chains
    );
  } else {
    try {
      const encryptedPrivateKey = runtime.getSetting(
        "ENCRYPTED_EVM_PRIVATE_KEY"
      );
      let privateKey: `0x${string}`;

      if (encryptedPrivateKey) {
        privateKey = `0x${decryptPrivateKey(
          encryptedPrivateKey
        )}` as `0x${string}`;
      } else {
        privateKey = generatePrivateKey();
      }

      const walletProvider = new WalletProvider(
        privateKey,
        runtime.cacheManager,
        chains
      );
      // Always set to baseSepolia regardless of the original chain
      walletProvider.switchChain("baseSepolia");
      return walletProvider;
    } catch (error) {
      console.error("Error initializing wallet provider:", error);
      throw error;
    }
  }
};

export const evmWalletProvider: Provider = {
  async get(
    runtime: IAgentRuntime,
    _message: Memory,
    state?: State
  ): Promise<string | null> {
    try {
      const walletProvider = await initWalletProvider(runtime);
      const address = walletProvider.getAddress();
      const balance = await walletProvider.getWalletBalance();
      const chain = walletProvider.getCurrentChain();
      const agentName = state?.agentName || "The agent";
      return `${agentName}'s EVM Wallet Address: ${address}\nBalance: ${balance} ${chain.nativeCurrency.symbol}\nChain ID: ${chain.id}, Name: ${chain.name}`;
    } catch (error) {
      console.error("Error in EVM wallet provider:", error);
      return null;
    }
  },
};
