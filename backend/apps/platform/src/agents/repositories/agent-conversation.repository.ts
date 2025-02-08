import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { AgentConversation } from '@apps/platform/agents/schemas';
import { AgentConversationEntity, MongoAgentConversationEntity } from '@apps/platform/agents/entities';

export interface AgentConversationRepository {
  findByTeamId(teamId: string): Promise<AgentConversationEntity[]>;
}

@Injectable()
export class MongoAgentConversationRepository implements AgentConversationRepository {
  public constructor(
    @InjectModel(AgentConversation.name) private readonly agentConversationModel: Model<AgentConversation>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findByTeamId(teamId: string) {
    const conversations = await this.agentConversationModel
      .find(
        {
          team: new ObjectId(teamId),
        },
        undefined,
        {
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
          lean: true,
        },
      )
      .exec();

    return conversations.map((conversation) => new MongoAgentConversationEntity(conversation));
  }
}
