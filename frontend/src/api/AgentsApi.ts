import { ApiClient } from "./ApiClient";

export enum AgentRole {
  Producer = 'producer',
  Influencer = 'influencer',
  Adviser = 'adviser',
}

export interface Agent {
  id: string;
  name: string;
  imageUrl: string;
  teamId: string;
  role: AgentRole;
  model: string;
  modelApiKey: string;
  config: unknown;
  description?: string;
}

export interface CreateAgentParams {
  name: string;
  role: AgentRole;
  teamId: string;
  model: string;
  modelApiKey: string;
  config: unknown;
  description?: string;
}

export interface UpdateAgentParams {
  name?: string;
  model?: string;
  modelApiKey?: string;
  config?: unknown;
  description?: string;
}

export interface AgentsApi {
  listTeamAgents(teamId: string): Promise<Agent[]>;
  getAgentById(agentId: string): Promise<Agent>;
  createAgent(params: CreateAgentParams): Promise<Agent>;
  updateAgent(agentId: string, params: UpdateAgentParams): Promise<Agent>;
}

export default class AgentsRestApi implements AgentsApi {
  public constructor(private client: ApiClient) {}

  public async listTeamAgents(teamId: string) {
    return this.client.makeCall<Agent[]>(`/agents?teamId=${teamId}`, 'GET');
  }

  public async getAgentById(agentId: string) {
    return this.client.makeCall<Agent>(`/agents/${agentId}`, 'GET');
  }

  public async createAgent(params: CreateAgentParams) {
    return this.client.makeCall<Agent>('/agents', 'POST', params);
  }

  public async updateAgent(agentId: string, params: UpdateAgentParams) {
    return this.client.makeCall<Agent>(`/agents/${agentId}`, 'PUT', params);
  }
}
