import { z } from "zod";
import type { Content } from "@elizaos/core";
import * as viemChains from "viem/chains";

const _SupportedChainList = Object.keys(viemChains) as Array<
  keyof typeof viemChains
>;
export type SupportedChain = (typeof _SupportedChainList)[number];

const supportedChainTuple = _SupportedChainList as unknown as [
  string,
  ...string[]
];

export interface MintNFTContent extends Content {
  collectionAddress: string;
  chainName: string;
}

export const MintNFTSchema = z.object({
  collectionAddress: z.string(),
  chainName: z.enum([...supportedChainTuple]).nullable(),
});

export const CreateCollectionSchema = z.object({
  chainName: z.enum([...supportedChainTuple]).nullable(),
});
