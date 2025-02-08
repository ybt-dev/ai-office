import {Injectable, NotFoundException, UnprocessableEntityException} from '@nestjs/common';
import {AgentTeamInteractionRepository, AgentTeamRepository} from '@apps/platform/agents/repositories';
import {AgentTeamInteractionEntityToDtoMapper} from '@apps/platform/agents/entities-mappers';
import {AgentTeamInteractionDto} from '@apps/platform/agents/dto';
import {
  InjectAgentTeamInteractionEntityToDtoMapper,
  InjectAgentTeamInteractionRepository,
  InjectAgentTeamRepository,
} from '@apps/platform/agents/decorators';
import { AgentTeamInteractionStatus } from "@apps/platform/agents/enums";

export interface CreateAgentTeamInteractionParams {
  title: string;
  requestContent: string;
  teamId: string;
  organizationId: string;
  createdById?: string;
}

export interface AgentTeamInteractionService {
  listByTeam(teamId: string, organizationId: string): Promise<AgentTeamInteractionDto[]>;
  get(id: string, organizationId: string): Promise<AgentTeamInteractionDto | null>;
  getIfExist(id: string, organizationId: string): Promise<AgentTeamInteractionDto>;
  create(params: CreateAgentTeamInteractionParams): Promise<AgentTeamInteractionDto>;
}

@Injectable()
export class DefaultAgentTeamInteractionService implements AgentTeamInteractionService {
  constructor(
    @InjectAgentTeamInteractionRepository()
    private readonly agentTeamInteractionRepository: AgentTeamInteractionRepository,
    @InjectAgentTeamRepository()
    private readonly agentTeamRepository: AgentTeamRepository,
    @InjectAgentTeamInteractionEntityToDtoMapper()
    private readonly agentTeamInteractionEntityToDtoMapper: AgentTeamInteractionEntityToDtoMapper,
  ) {}

  public async listByTeam(teamId: string, organizationId: string): Promise<AgentTeamInteractionDto[]> {
    const entities = await this.agentTeamInteractionRepository.findMany({
      teamId,
      organizationId,
    });

    return this.agentTeamInteractionEntityToDtoMapper.mapMany(entities);
  }

  public async get(id: string, organizationId: string): Promise<AgentTeamInteractionDto> {
    const agentTeamInteractionEntity = await this.agentTeamInteractionRepository.findByIdAndOrganizationId(
      id,
      organizationId,
    );

    return agentTeamInteractionEntity && this.agentTeamInteractionEntityToDtoMapper.mapOne(agentTeamInteractionEntity);
  }

  public async getIfExist(id: string, organizationId: string): Promise<AgentTeamInteractionDto> {
    const agentTeamInteraction = await this.get(id, organizationId);

    if (!agentTeamInteraction) {
      throw new NotFoundException(`Agent team interaction with id ${id} not found`);
    }

    return agentTeamInteraction;
  }

  public async create(params: CreateAgentTeamInteractionParams): Promise<AgentTeamInteractionDto> {
    const team = await this.agentTeamRepository.findByIdAndOrganizationId(
      params.teamId,
      params.organizationId,
    );

    if (!team) {
      throw new UnprocessableEntityException(`Team with id ${params.teamId} not found`);
    }

    const entity = await this.agentTeamInteractionRepository.createOne({
      title: params.title,
      requestContent: params.requestContent,
      team: params.teamId,
      organization: params.organizationId,
      createdBy: params.createdById,
      status: AgentTeamInteractionStatus.New,
    });

    return this.agentTeamInteractionEntityToDtoMapper.mapOne(entity);
  }
}
