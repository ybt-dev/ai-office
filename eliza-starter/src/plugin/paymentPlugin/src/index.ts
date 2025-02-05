import { Plugin } from "@elizaos/core";
import {
  ProducerService,
  WalletService,
  TransactionService,
} from "../services";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error("WALLET_ENCRYPTION_KEY environment variable is required");
}

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const transactionService = new TransactionService(provider);
const walletService = new WalletService(ENCRYPTION_KEY, transactionService);

export const paymentPlugin: Plugin = {
  name: "payment",
  description: "Payment functionality plugin",
  actions: [], // Add payment related actions here
  evaluators: [], // Add payment related evaluators here
  providers: [], // Add payment related providers here
  services: [
    transactionService,
    walletService,
    new ProducerService(transactionService, walletService),
  ],
};

export default paymentPlugin;
