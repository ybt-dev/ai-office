import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AgentTeam } from '@apps/platform/agents/schemas';

export interface AgentTeamEntity {
  getId(): string;
  getOrganizationId(): string;
  getName(): string;
  getDescription(): string;
  getStrategy(): string;
  getImageUrl(): string;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
  getCreatedById(): string;
  getUpdatedById(): string;
}

export class MongoAgentTeamEntity implements AgentTeamEntity {
  constructor(private readonly agentTeamDocument: FlattenMaps<AgentTeam> & { _id: ObjectId }) {}

  public getId() {
    return this.agentTeamDocument._id.toString();
  }

  public getOrganizationId() {
    return this.agentTeamDocument.organization.toString();
  }

  public getName() {
    return this.agentTeamDocument.name;
  }

  public getDescription() {
    return this.agentTeamDocument.description;
  }

  public getStrategy() {
    return this.agentTeamDocument.strategy;
  }

  public getImageUrl() {
    return this.agentTeamDocument.imageUrl || '';
  }

  public getCreatedAt() {
    return this.agentTeamDocument.createdAt;
  }

  public getUpdatedAt() {
    return this.agentTeamDocument.updatedAt;
  }

  public getCreatedById() {
    return this.agentTeamDocument.createdBy.toString();
  }

  public getUpdatedById() {
    return this.agentTeamDocument.updatedBy.toString();
  }
}
