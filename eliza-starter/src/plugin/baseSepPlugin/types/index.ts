import type { Token } from "@lifi/types";
import type {
  Account,
  Address,
  Chain,
  Hash,
  HttpTransport,
  PublicClient,
  WalletClient,
  Log,
} from "viem";
import * as viemChains from "viem/chains";

// List of supported chains from viemChains
const _SupportedChainList = Object.keys(viemChains) as Array<
  keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

// Transaction types
export interface Transaction {
  hash: Hash;
  from: Address;
  to: Address;
  value: bigint;
  data?: `0x${string}`;
  chainId?: number;
  logs?: Log[];
}

// Token types
export interface TokenWithBalance {
  token: Token;
  balance: bigint;
  formattedBalance: string;
  priceUSD: string;
  valueUSD: string;
}

export interface WalletBalance {
  chain: SupportedChain;
  address: Address;
  totalValueUSD: string;
  tokens: TokenWithBalance[];
}

// Chain configuration
export interface ChainMetadata {
  chainId: number;
  name: string;
  chain: Chain;
  rpcUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl: string;
}

export interface ChainConfig {
  chain: Chain;
  publicClient: PublicClient<HttpTransport, Chain, Account | undefined>;
  walletClient?: WalletClient;
}

// Action parameters
export interface TransferParams {
  fromChain: SupportedChain;
  toAddress: Address;
  amount: string;
  data?: `0x${string}`;
}
// Plugin configuration
export interface EvmPluginConfig {
  rpcUrl?: {
    base?: string;
    sepolia?: string;
  };
  secrets?: {
    EVM_PRIVATE_KEY: string;
  };
  testMode?: boolean;
  multicall?: {
    batchSize?: number;
    wait?: number;
  };
}

// LiFi types
export type LiFiStatus = {
  status: "PENDING" | "DONE" | "FAILED";
  substatus?: string;
  error?: Error;
};

export type LiFiRoute = {
  transactionHash: Hash;
  transactionData: `0x${string}`;
  toAddress: Address;
  status: LiFiStatus;
};

// Provider types
export interface TokenData extends Token {
  symbol: string;
  decimals: number;
  address: Address;
  name: string;
  logoURI?: string;
  chainId: number;
}

export interface TokenPriceResponse {
  priceUSD: string;
  token: TokenData;
}

export interface TokenListResponse {
  tokens: TokenData[];
}
