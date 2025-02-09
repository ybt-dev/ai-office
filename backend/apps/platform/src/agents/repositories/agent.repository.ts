import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTransactionsManager } from '@libs/transactions/decorators';
import { TransactionsManager } from '@libs/transactions/managers';
import { MongodbTransaction } from '@libs/mongodb-transactions';
import { AnyObject } from '@libs/types';
import { Agent } from '@apps/platform/agents/schemas';
import { AgentEntity, MongoAgentEntity } from '@apps/platform/agents/entities';
import { AgentRole } from '@apps/platform/agents/enums';

export interface IFindAgentTeamFilter {
  organizationId: string;
  teamId?: string;
}

export interface CreateAgentEntityParams {
  name: string;
  team: string;
  role: AgentRole;
  model: string;
  modelApiKey: string;
  config: AnyObject;
  organization: string;
  description?: string;
  imageUrl?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  walletAddress: string;
  encryptedPrivateKey: string;
}

export interface AgentRepository {
  findMany(filter: IFindAgentTeamFilter): Promise<AgentEntity[]>;
  findByIdAndOrganizationId(id: string, organizationId: string): Promise<AgentEntity | null>;
  createOne(params: CreateAgentEntityParams): Promise<AgentEntity>;
}

@Injectable()
export class MongoAgentRepository implements AgentRepository {
  public constructor(
    @InjectModel(Agent.name) private readonly agentModel: Model<Agent>,
    @InjectTransactionsManager() private readonly transactionsManager: TransactionsManager<MongodbTransaction>,
  ) {}

  public async findMany(filter: IFindAgentTeamFilter) {
    const agents = await this.agentModel
      .find(
        {
          ...(filter.teamId && { team: new ObjectId(filter.teamId) }),
          organization: new ObjectId(filter.organizationId),
        },
        undefined,
        {
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return agents.map((team) => new MongoAgentEntity(team));
  }

  public async findByIdAndOrganizationId(id: string, organizationId: string) {
    const agent = await this.agentModel
      .findOne(
        {
          _id: new ObjectId(id),
          organization: new ObjectId(organizationId),
        },
        undefined,
        {
          lean: true,
          session: this.transactionsManager.getCurrentTransaction()?.getSession(),
        },
      )
      .exec();

    return agent ? new MongoAgentEntity(agent) : null;
  }

  public async createOne(params: CreateAgentEntityParams) {
    const [team] = await this.agentModel.create([params], {
      session: this.transactionsManager.getCurrentTransaction()?.getSession(),
    });

    return new MongoAgentEntity(team);
  }
}
