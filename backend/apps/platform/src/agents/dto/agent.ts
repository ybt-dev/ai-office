import { IsIn, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { IsIdentifier } from '@libs/validation/class-validators';
import { AnyObject } from '@libs/types';
import { AgentRole } from '@apps/platform/agents/enums';

export interface AgentDto {
  id: string;
  name: string;
  model: string;
  role: AgentRole;
  modelApiKey: string;
  config: AnyObject;
  teamId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  imageUrl?: string;
  createdById?: string | null;
  updatedById?: string | null;
}

export class ListAgentsQueryDto {
  @IsIdentifier()
  @IsNotEmpty()
  teamId: string;
}

export class CreateAgentBodyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(Object.values(AgentRole))
  role: AgentRole;

  @IsIdentifier()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  modelApiKey: string;

  @IsString()
  description: string;
}

export class UpdateAgentBodyDto {
  @IsString()
  name: string;

  @IsString()
  model: string;

  @IsString()
  modelApiKey: string;

  @IsString()
  description: string;
}
