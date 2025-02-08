import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { AnyObject } from '@libs/types';
import { AgentRepository, AgentTeamRepository } from '@apps/platform/agents/repositories';
import {
  InjectAgentRepository,
  InjectAgentEntityToDtoMapper,
  InjectAgentTeamRepository,
} from '@apps/platform/agents/decorators';
import { AgentDto } from '@apps/platform/agents/dto';
import { AgentEntityToDtoMapper } from '@apps/platform/agents/entities-mappers';
import { AgentRole } from '@apps/platform/agents/enums';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { AES, enc } from 'crypto-js';

export interface CreateAgentParams {
  role: AgentRole;
  organizationId: string;
  model: string;
  modelApiKey: string;
  config: AnyObject;
  teamId: string;
  name: string;
  createdById: string;
  description?: string;
  walletAddress: string;
  encryptedPrivateKey: string;
}

export interface AgentService {
  listForTeam(teamId: string, organizationId: string): Promise<AgentDto[]>;
  get(id: string, organizationId: string): Promise<AgentDto | null>;
  getIfExist(id: string, organizationId: string): Promise<AgentDto>;
  create(params: CreateAgentParams): Promise<AgentDto>;
}

@Injectable()
export class DefaultAgentService implements AgentService {
  constructor(
    @InjectAgentRepository() private readonly agentRepository: AgentRepository,
    @InjectAgentTeamRepository() private readonly agentTeamRepository: AgentTeamRepository,
    @InjectAgentEntityToDtoMapper() private agentEntityToDtoMapper: AgentEntityToDtoMapper,
  ) {}

  public async listForTeam(teamId: string, organizationId: string) {
    const agentEntities = await this.agentRepository.findMany({
      teamId,
      organizationId,
    });

    return this.agentEntityToDtoMapper.mapMany(agentEntities);
  }

  public async get(id: string, organizationId: string) {
    const agentEntity = await this.agentRepository.findByIdAndOrganizationId(id, organizationId);

    return agentEntity && this.agentEntityToDtoMapper.mapOne(agentEntity);
  }

  public async getIfExist(id: string, organizationId: string) {
    const agent = await this.get(id, organizationId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  public async create(params: CreateAgentParams) {
    const team = await this.agentTeamRepository.findByIdAndOrganizationId(params.teamId, params.organizationId);

    if (!team) {
      throw new UnprocessableEntityException('Provided Agent Team does not exist.');
    }

    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    const encryptionKey = process.env.WALLET_ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('WALLET_ENCRYPTION_KEY environment variable is not set');
    }

    const encryptedPrivateKey = AES.encrypt(privateKey, encryptionKey).toString();

    const agentEntity = await this.agentRepository.createOne({
      name: params.name,
      role: params.role,
      team: params.teamId,
      model: params.model,
      modelApiKey: params.modelApiKey,
      config: params.config,
      imageUrl: '',
      description: params.description,
      organization: params.organizationId,
      createdBy: params.createdById,
      updatedBy: params.createdById,
      walletAddress: account.address,
      encryptedPrivateKey: encryptedPrivateKey,
    });

    return this.agentEntityToDtoMapper.mapOne(agentEntity);
  }

  private decryptPrivateKey(encryptedPrivateKey: string): string {
    const encryptionKey = process.env.WALLET_ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('WALLET_ENCRYPTION_KEY environment variable is not set');
    }

    const bytes = AES.decrypt(encryptedPrivateKey, encryptionKey);
    return bytes.toString(enc.Utf8);
  }
}
