import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  vi,
  afterEach,
} from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { mainnet, iotex, arbitrum, type Chain } from "viem/chains";
import { AES, enc } from "crypto-js";

import { WalletProvider, initWalletProvider } from "../providers/wallet.ts";

const customRpcUrls = {
  baseSepolia: "custom-rpc.base-sepolia.io",
};

// Mock the ICacheManager
const mockCacheManager = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn(),
};

// Add global beforeAll to set up environment
beforeAll(() => {
  // Store original env
  const originalEnv = { ...process.env };

  // Set up test environment variables
  process.env.WALLET_ENCRYPTION_KEY = "test-encryption-key-12345";

  // Clean up after all tests
  return () => {
    process.env = originalEnv;
  };
});

describe("Wallet provider", () => {
  let walletProvider: WalletProvider;
  let pk: `0x${string}`;
  const customChains: Record<string, Chain> = {};

  beforeAll(() => {
    pk = generatePrivateKey();
    customChains["baseSepolia"] =
      WalletProvider.genChainFromName("baseSepolia");
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheManager.get.mockResolvedValue(null);
  });

  describe("Constructor", () => {
    it("sets address", () => {
      const account = privateKeyToAccount(pk);
      const expectedAddress = account.address;

      walletProvider = new WalletProvider(pk, mockCacheManager as any);

      expect(walletProvider.getAddress()).toEqual(expectedAddress);
    });
    it("sets default chain to Base Sepolia", () => {
      walletProvider = new WalletProvider(pk, mockCacheManager as any);

      expect(walletProvider.getCurrentChain().id).toEqual(84532); // Base Sepolia chain ID
    });
    it("sets custom chain", () => {
      walletProvider = new WalletProvider(
        pk,
        mockCacheManager as any,
        customChains
      );

      expect(walletProvider.chains.baseSepolia.id).toEqual(84532);
    });
  });
  describe("Clients", () => {
    beforeEach(() => {
      walletProvider = new WalletProvider(pk, mockCacheManager as any);
    });
    it("generates public client", () => {
      const client = walletProvider.getPublicClient("baseSepolia");
      expect(client.chain.id).toEqual(84532);
      expect(client.transport.url).toEqual("https://sepolia.base.org");
    });
    it("generates public client with custom rpcurl", () => {
      const chain = WalletProvider.genChainFromName(
        "baseSepolia",
        customRpcUrls.baseSepolia
      );
      const wp = new WalletProvider(pk, mockCacheManager as any, {
        baseSepolia: chain,
      });

      const client = wp.getPublicClient("baseSepolia");
      expect(client.chain.id).toEqual(84532);
      expect(client.chain.rpcUrls.default.http[0]).toEqual(
        "https://sepolia.base.org"
      );
      expect(client.chain.rpcUrls.custom.http[0]).toEqual(
        customRpcUrls.baseSepolia
      );
      expect(client.transport.url).toEqual(customRpcUrls.baseSepolia);
    });
    it("generates wallet client", () => {
      const account = privateKeyToAccount(pk);
      const expectedAddress = account.address;

      const client = walletProvider.getWalletClient("baseSepolia");

      expect(client.account.address).toEqual(expectedAddress);
      expect(client.transport.url).toEqual("https://sepolia.base.org");
    });
  });
  describe("Balance", () => {
    beforeEach(() => {
      walletProvider = new WalletProvider(
        pk,
        mockCacheManager as any,
        customChains
      );
    });
    it("should fetch balance", async () => {
      const bal = await walletProvider.getWalletBalance();
      expect(bal).toEqual("0");
    });
    it("should fetch balance for Base Sepolia chain", async () => {
      const bal = await walletProvider.getWalletBalanceForChain("baseSepolia");
      expect(bal).toEqual("0");
    });
    it("should return null if chain is not Base Sepolia", async () => {
      const bal = await walletProvider.getWalletBalanceForChain(
        "mainnet" as any
      );
      expect(bal).toBeNull();
    });
  });
  describe("Chain", () => {
    beforeEach(() => {
      walletProvider = new WalletProvider(
        pk,
        mockCacheManager as any,
        customChains
      );
    });
    it("generates chain from Base Sepolia name", () => {
      const chain: Chain = WalletProvider.genChainFromName("baseSepolia");
      expect(chain.id).toEqual(84532);
      expect(chain.rpcUrls.default.http[0]).toEqual("https://sepolia.base.org");
    });
    it("generates chain with custom rpc url", () => {
      const customRpcUrl = "custom.url.io";
      const chain: Chain = WalletProvider.genChainFromName(
        "baseSepolia",
        customRpcUrl
      );

      expect(chain.rpcUrls.default.http[0]).toEqual("https://sepolia.base.org");
      expect(chain.rpcUrls.custom.http[0]).toEqual(customRpcUrl);
    });
    it("throws if unsupported chain name", () => {
      expect(() => WalletProvider.genChainFromName("ethereum")).toThrow();
    });
    it("throws if invalid chain name", () => {
      expect(() => WalletProvider.genChainFromName("invalid")).toThrow();
    });
  });

  describe("Initialization", () => {
    const mockRuntime = {
      getSetting: vi.fn(),
      cacheManager: mockCacheManager,
      agentId: "test-agent",
    };

    beforeEach(() => {
      vi.resetModules();
      // Ensure encryption key is set for each test
      process.env.WALLET_ENCRYPTION_KEY = "test-encryption-key-12345";
      mockRuntime.getSetting.mockReset();
    });

    it("should initialize with encrypted private key", async () => {
      // Create and encrypt a test private key
      const testPrivateKey =
        "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const encryptedKey = AES.encrypt(
        testPrivateKey,
        process.env.WALLET_ENCRYPTION_KEY!
      ).toString();

      mockRuntime.getSetting.mockImplementation((key: string) => {
        switch (key) {
          case "ENCRYPTED_EVM_PRIVATE_KEY":
            return encryptedKey;
          case "TEE_MODE":
            return "OFF";
          case "ETHEREUM_PROVIDER_BASE":
            return "https://sepolia.base.org";
          default:
            return null;
        }
      });

      const walletProvider = await initWalletProvider(mockRuntime as any);

      expect(walletProvider).toBeInstanceOf(WalletProvider);
      expect(walletProvider.getCurrentChain().id).toBe(84532);
    });

    it("should generate new wallet if no encrypted key provided", async () => {
      mockRuntime.getSetting.mockImplementation((key: string) => {
        switch (key) {
          case "TEE_MODE":
            return "OFF";
          case "ETHEREUM_PROVIDER_BASE":
            return "https://sepolia.base.org";
          default:
            return null;
        }
      });

      const walletProvider = await initWalletProvider(mockRuntime as any);

      expect(walletProvider).toBeInstanceOf(WalletProvider);
      expect(walletProvider.getCurrentChain().id).toBe(84532);
      expect(walletProvider.getAddress()).toBeTruthy();
    });

    it("should throw error if WALLET_ENCRYPTION_KEY is missing", async () => {
      delete process.env.WALLET_ENCRYPTION_KEY;

      const testPrivateKey =
        "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
      const encryptedKey = AES.encrypt(testPrivateKey, "test-key").toString();

      mockRuntime.getSetting.mockImplementation((key: string) => {
        switch (key) {
          case "ENCRYPTED_EVM_PRIVATE_KEY":
            return encryptedKey;
          case "TEE_MODE":
            return "OFF";
          case "ETHEREUM_PROVIDER_BASE":
            return "https://sepolia.base.org";
          default:
            return null;
        }
      });

      await expect(initWalletProvider(mockRuntime as any)).rejects.toThrow(
        "WALLET_ENCRYPTION_KEY environment variable is not set"
      );
    });

    it("should always set network to Base Sepolia", async () => {
      mockRuntime.getSetting.mockImplementation((key: string) => {
        switch (key) {
          case "TEE_MODE":
            return "OFF";
          case "ETHEREUM_PROVIDER_BASE":
            return "https://sepolia.base.org";
          default:
            return null;
        }
      });

      const walletProvider = await initWalletProvider(mockRuntime as any);

      expect(walletProvider.getCurrentChain().id).toBe(84532);
      expect(walletProvider.getCurrentChain().name).toBe("Base Sepolia");
    });
  });
});
