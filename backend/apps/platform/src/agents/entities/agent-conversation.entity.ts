import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AgentConversation } from '@apps/platform/agents/schemas';

export interface AgentConversationEntity {
  getId(): string;
  getOrganizationId(): string;
  getTeamId(): string;
  getSourceAgentId(): string;
  getTargetAgentId(): string;
  getContent(): string;
  getCreatedAt(): Date;
}

export class MongoAgentConversationEntity implements AgentConversationEntity {
  constructor(private readonly agentConversationDocument: FlattenMaps<AgentConversation> & { _id: ObjectId }) {}

  public getId() {
    return this.agentConversationDocument._id.toString();
  }

  public getOrganizationId() {
    return this.agentConversationDocument.organization.toString();
  }

  public getTeamId() {
    return this.agentConversationDocument.team.toString();
  }

  public getSourceAgentId() {
    return this.agentConversationDocument.sourceAgent.toString();
  }

  public getTargetAgentId() {
    return this.agentConversationDocument.targetAgent.toString();
  }

  public getContent() {
    return this.agentConversationDocument.content;
  }

  public getCreatedAt() {
    return this.agentConversationDocument.createdAt;
  }
}
