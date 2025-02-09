import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import type { Account, Chain } from "viem";

import { TransferAction } from "../actions/transfer.ts";
import { WalletProvider } from "../providers/wallet.ts";

// Mock the ICacheManager
const mockCacheManager = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn(),
};

describe("Transfer Action", () => {
  let wp: WalletProvider;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCacheManager.get.mockResolvedValue(null);

    const pk = generatePrivateKey();
    const customChains = prepareChains();
    wp = new WalletProvider(pk, mockCacheManager as any, customChains);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Constructor", () => {
    it("should initialize with wallet provider", () => {
      const ta = new TransferAction(wp);

      expect(ta).toBeDefined();
    });
  });
  describe("Transfer", () => {
    let ta: TransferAction;
    let receiver: Account;

    beforeEach(() => {
      ta = new TransferAction(wp);
      receiver = privateKeyToAccount(generatePrivateKey());
    });

    it("throws if not enough gas on iotexTestnet", async () => {
      await expect(
        ta.transfer({
          fromChain: "iotexTestnet",
          toAddress: receiver.address,
          amount: "1",
        })
      ).rejects.toThrow(
        "Transfer failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
      );
    });

    it("throws if not enough gas on baseSepolia", async () => {
      await expect(
        ta.transfer({
          fromChain: "baseSepolia",
          toAddress: receiver.address,
          amount: "1",
        })
      ).rejects.toThrow(
        "Transfer failed: The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
      );
    });
  });
});

const prepareChains = () => {
  const customChains: Record<string, Chain> = {};
  const chainNames = ["iotexTestnet", "baseSepolia"];
  chainNames.forEach(
    (chain) => (customChains[chain] = WalletProvider.genChainFromName(chain))
  );

  return customChains;
};
