import { ApiClient } from "~/api/ApiClient";

export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  strategy: string;
  imageUrl: string;
}

export interface CreateAgentTeamParams {
  name: string;
  description: string;
  strategy: string;
}

export interface AgentTeamsApi {
  listAgentTeams(): Promise<AgentTeam[]>;
  createAgentTeam(params: CreateAgentTeamParams): Promise<AgentTeam>;
  getAgentTeamById(id: string): Promise<AgentTeam>;
}

export default class AgentTeamsRestApi implements AgentTeamsApi {
  public constructor(private client: ApiClient) {}

  public async listAgentTeams() {
    return this.client.makeCall('/agent-teams', 'GET');
  }

  public async createAgentTeam(params: CreateAgentTeamParams) {
    return this.client.makeCall('/agent-teams', 'POST', params);
  }

  public async getAgentTeamById(id: string) {
    return this.client.makeCall(`/agent-teams/${id}`, 'GET');
  }
}
