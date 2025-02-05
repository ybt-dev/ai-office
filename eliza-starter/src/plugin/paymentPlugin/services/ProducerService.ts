import { Service, ServiceType } from "@elizaos/core";
import { ITransactionService } from "./TransactionService";
import { IWalletService } from "./WalletService";

export class ProducerService implements Service {
  readonly serviceType: ServiceType = ServiceType.TEXT_GENERATION;

  constructor(
    private readonly transactionService: ITransactionService,
    private readonly walletService: IWalletService
  ) {}

  async initialize(): Promise<void> {
    await this.transactionService.initialize();
    await this.walletService.initialize();
  }

  async distributePayments(
    fromAddress: string,
    totalAmount: string,
    influencerAddress: string,
    agentAddress: string,
    influencerShare: number // 0-100%
  ): Promise<{
    influencerTx: string;
    agentTx: string;
  }> {
    const influencerAmount = Math.floor(
      Number(totalAmount) * (influencerShare / 100)
    ).toString();

    const agentAmount = (
      Number(totalAmount) - Number(influencerAmount)
    ).toString();

    const influencerTx = await this.transactionService.transfer(
      fromAddress,
      influencerAddress,
      influencerAmount
    );

    const agentTx = await this.transactionService.transfer(
      fromAddress,
      agentAddress,
      agentAmount
    );

    return {
      influencerTx,
      agentTx,
    };
  }

  monitorTransactions(): void {
    this.transactionService.subscribeToTransfers((from, to, amount) => {
      console.log(`Transfer detected:
        From: ${from}
        To: ${to}
        Amount: ${amount} USDC
      `);
    });
  }
}
