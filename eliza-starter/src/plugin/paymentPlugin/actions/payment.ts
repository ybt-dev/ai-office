import {
  Action,
  IAgentRuntime,
  Memory,
  State,
  HandlerCallback,
} from "@elizaos/core";
import {
  TransactionService,
  ITransactionService,
} from "../services/TransactionService.ts";
import { WalletService, IWalletService } from "../services/WalletService.ts";

export class PaymentAction implements Action {
  name = "PROCESS_PAYMENT";
  similes = ["SEND_PAYMENT", "TRANSFER_FUNDS", "PAY"];

  description = "Process payments between parties";
  suppressInitialMessage = true;

  examples = [
    [
      {
        user: "{{user}}",
        content: { text: "send 100 ETH to @john" },
      },
      {
        user: "{{system}}",
        content: {
          text: "Payment of 100 ETH to @john processed successfully",
          action: "PROCESS_PAYMENT",
        },
      },
    ],
  ];

  async validate(runtime: IAgentRuntime, message: Memory): Promise<boolean> {
    const content =
      typeof message.content === "string"
        ? message.content
        : message.content?.text;

    const hasPriceKeyword = /\b(price|value|worth|cost)\b/i.test(content);
    const hasToken =
      /0x[a-fA-F0-9]{40}/.test(content) || /[\$#]?[a-zA-Z0-9]+/i.test(content);

    return hasPriceKeyword && hasToken;
  }

  async handler(
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options: { [key: string]: unknown } = {},
    callback?: HandlerCallback
  ): Promise<boolean> {
    try {
      const transactionService = Array.from(runtime.services.values()).find(
        (s) => s instanceof TransactionService
      ) as ITransactionService;
      const walletService = Array.from(runtime.services.values()).find(
        (s) => s instanceof WalletService
      ) as IWalletService;

      if (!transactionService || !walletService) {
        throw new Error("Required services not found");
      }

      // Extract payment details from message
      const {
        amount,
        recipient,
        currency = "ETH",
      } = (message.content as {
        amount?: string;
        recipient?: string;
        currency?: string;
      }) || {};

      if (!amount || !recipient) {
        throw new Error(
          "Missing required payment details: amount and recipient are required"
        );
      }

      // Validate amount
      const paymentAmount = parseFloat(amount);
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        throw new Error("Invalid payment amount");
      }

      const senderAddress = walletService.getWalletAddress();

      // Check wallet balance
      const balance = await walletService.getBalance(senderAddress);
      if (Number(balance) < paymentAmount) {
        throw new Error("Insufficient funds");
      }

      // Process the payment
      const txHash = await transactionService.transfer(
        senderAddress,
        recipient,
        paymentAmount.toString()
      );

      // Wait for transaction confirmation
      const status = await transactionService.getTransactionStatus(txHash);
      if (status !== "SUCCESS") {
        throw new Error("Transaction failed");
      }

      // Handle callback response
      if (callback) {
        await callback({
          text: `Payment of ${paymentAmount} ${currency} to ${recipient} processed successfully (tx: ${txHash})`,
          action: this.name,
        });
      }

      // Update state if needed
      if (state) {
        state.responseData = {
          text: `Payment of ${paymentAmount} ${currency} to ${recipient} processed successfully (tx: ${txHash})`,
          paymentAmount,
          recipient,
          currency,
          transactionHash: txHash,
        };
      }

      return true;
    } catch (error) {
      console.error("Error in payment action:", error);
      if (callback) {
        await callback({
          text: `Payment processing failed: ${error.message}`,
          action: this.name,
        });
      }
      return false;
    }
  }
}

export const paymentAction = new PaymentAction();
