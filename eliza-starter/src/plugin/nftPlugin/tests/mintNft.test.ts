import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { MintNFTAction } from "../actions/mintNft";
import { privateKeyToAccount } from "viem/accounts";

// Mock the IAgentRuntime
const mockRuntime = {
  getSetting: vi
    .fn()
    .mockReturnValue(
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    ),
};

// Mock viem clients
vi.mock("viem", () => ({
  createPublicClient: vi.fn().mockReturnValue({
    waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: "success" }),
  }),
  createWalletClient: vi.fn().mockReturnValue({
    writeContract: vi.fn().mockResolvedValue("0xmockedTransactionHash"),
  }),
  http: vi.fn(),
}));

describe("MintNFT Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Constructor", () => {
    it("should initialize with runtime", () => {
      const action = new MintNFTAction(mockRuntime as any);
      expect(action).toBeDefined();
    });

    it("should throw if private key is not found", () => {
      const runtimeWithoutKey = {
        getSetting: vi.fn().mockReturnValue(null),
      };

      expect(() => new MintNFTAction(runtimeWithoutKey as any)).toThrow(
        "EVM private key not found"
      );
    });
  });

  describe("mintNFT", () => {
    let action: MintNFTAction;

    beforeEach(() => {
      action = new MintNFTAction(mockRuntime as any);
    });

    it("should successfully mint an NFT", async () => {
      const result = await action.mintNFT({
        collectionAddress: "0x1234567890123456789012345678901234567890",
        chainName: "baseSepolia",
        text: "test",
      });

      expect(result).toEqual({
        hash: "0xmockedTransactionHash",
        collectionAddress: "0x1234567890123456789012345678901234567890",
        chain: expect.any(Object),
      });
    });

    it("should throw on invalid content", async () => {
      await expect(action.mintNFT({} as any)).rejects.toThrow(
        "Invalid content for MINT_NFT action"
      );
    });
  });
});
