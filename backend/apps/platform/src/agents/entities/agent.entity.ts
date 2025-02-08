import { FlattenMaps } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AnyObject } from '@libs/types';
import { Agent } from '@apps/platform/agents/schemas';
import { AgentRole } from '@apps/platform/agents/enums';

export interface AgentEntity {
  getId(): string;
  getTeamId(): string;
  getOrganizationId(): string;
  getName(): string;
  getRole(): AgentRole;
  getModel(): string;
  getModelApiKey(): string;
  getConfig(): AnyObject;
  getDescription(): string | undefined;
  getImageUrl(): string | undefined;
  getCreatedAt(): Date;
  getUpdatedAt(): Date;
  getCreatedById(): string;
  getUpdatedById(): string;
}

export class MongoAgentEntity implements AgentEntity {
  constructor(private readonly agentDocument: FlattenMaps<Agent> & { _id: ObjectId }) {}

  public getId() {
    return this.agentDocument._id.toString();
  }

  public getRole() {
    return this.agentDocument.role;
  }

  public getTeamId() {
    return this.agentDocument.team.toString();
  }

  public getOrganizationId() {
    return this.agentDocument.organization.toString();
  }

  public getName() {
    return this.agentDocument.name;
  }

  public getModel() {
    return this.agentDocument.model;
  }

  public getModelApiKey() {
    return this.agentDocument.modelApiKey;
  }

  public getConfig() {
    return this.agentDocument.config;
  }

  public getDescription() {
    return this.agentDocument.description;
  }

  public getImageUrl() {
    return this.agentDocument.imageUrl || '';
  }

  public getCreatedAt() {
    return this.agentDocument.createdAt;
  }

  public getUpdatedAt() {
    return this.agentDocument.updatedAt;
  }

  public getCreatedById() {
    return this.agentDocument.createdBy.toString();
  }

  public getUpdatedById() {
    return this.agentDocument.updatedBy.toString();
  }
}
