import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { NFTCollectionAction } from "../actions/nftCollectionGeneration";
import * as viemChains from "viem/chains";
import {
  generateERC721ContractCode,
  compileContract,
  deployContract,
} from "../utils/deployEVMContract";

// Mock the IAgentRuntime
const mockRuntime = {
  getSetting: vi
    .fn()
    .mockReturnValue(
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    ),
  character: {
    name: "Test Character",
  },
};

// Mock viem clients
vi.mock("viem", () => ({
  createPublicClient: vi.fn().mockReturnValue({
    waitForTransactionReceipt: vi.fn().mockResolvedValue({ status: "success" }),
  }),
  createWalletClient: vi.fn().mockReturnValue({
    deployContract: vi.fn().mockResolvedValue("0xmockedContractAddress"),
  }),
  http: vi.fn(),
}));

// Mock contract deployment utilities
vi.mock("../utils/deployEVMContract", () => ({
  generateERC721ContractCode: vi.fn().mockReturnValue("mock contract code"),
  compileContract: vi.fn().mockResolvedValue({
    abi: [],
    bytecode: "0x",
  }),
  deployContract: vi.fn().mockResolvedValue("0xmockedContractAddress"),
}));

describe("NFTCollection Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Constructor", () => {
    it("should initialize with runtime and chain", () => {
      const action = new NFTCollectionAction(
        mockRuntime as any,
        viemChains.baseSepolia
      );
      expect(action).toBeDefined();
    });

    it("should throw if private key is not found", () => {
      const runtimeWithoutKey = {
        getSetting: vi.fn().mockReturnValue(null),
      };

      expect(
        () =>
          new NFTCollectionAction(
            runtimeWithoutKey as any,
            viemChains.baseSepolia
          )
      ).toThrow("EVM private key not found");
    });
  });

  describe("generateCollection", () => {
    let action: NFTCollectionAction;

    beforeEach(() => {
      action = new NFTCollectionAction(
        mockRuntime as any,
        viemChains.baseSepolia
      );
    });

    it("should successfully generate a collection", async () => {
      const contractAddress = await action.generateCollection();
      expect(contractAddress).toBe("0xmockedContractAddress");
    });

    it("should handle contract compilation failure", async () => {
      vi.mocked(compileContract).mockResolvedValueOnce(null);

      await expect(action.generateCollection()).rejects.toThrow(
        "Contract compilation failed or produced invalid output"
      );
    });

    it("should handle deployment failure", async () => {
      vi.mocked(deployContract).mockResolvedValueOnce(null);

      await expect(action.generateCollection()).rejects.toThrow(
        "Contract deployment failed"
      );
    });
  });
});
