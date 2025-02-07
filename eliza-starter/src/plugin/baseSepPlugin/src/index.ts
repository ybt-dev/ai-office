export * from "../actions/transfer.ts";
export * from "../providers/wallet.ts";
export * from "../types/index.ts";

import type { Plugin } from "@elizaos/core";
import { transferAction } from "../actions/transfer.ts";
import { evmWalletProvider } from "../providers/wallet.ts";

export const baseSepPlugin: Plugin = {
  name: "baseSep",
  description: "Base Sepolia EVM blockchain integration plugin",
  providers: [evmWalletProvider],
  evaluators: [],
  services: [],
  actions: [transferAction],
};

export default baseSepPlugin;
