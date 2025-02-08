import { Injectable } from '@nestjs/common';
import { AgentTeamEntity } from '@apps/platform/agents/entities';
import { AgentConversationDto } from '@apps/platform/agents/dto';
import { AgentConversationEntity } from '@apps/platform/agents/entities';

export interface AgentConversationEntityToDtoMapper {
  mapOne(entity: AgentConversationEntity): AgentConversationDto;
  mapMany(entities: AgentConversationEntity[]): AgentConversationDto[];
}

@Injectable()
export class DefaultAgentConversationEntityToDtoMapper implements AgentConversationEntityToDtoMapper {
  public mapOne(entity: AgentConversationEntity): AgentConversationDto {
    return {
      id: entity.getId(),
      sourceAgentId: entity.getSourceAgentId(),
      targetAgentId: entity.getTargetAgentId(),
      content: entity.getContent(),
      teamId: entity.getTeamId(),
      organizationId: entity.getOrganizationId(),
      createdAt: entity.getCreatedAt(),
    };
  }

  public mapMany(entities: AgentConversationEntity[]): AgentConversationDto[] {
    return entities.map((entity) => this.mapOne(entity));
  }
}
