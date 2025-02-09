import { ApiClient } from "./ApiClient";

export interface AgentConversation {
  teamId: string;
  sourceAgentId: string;
  targetAgentId: string;
  content: string;
}

export interface AgentConversationsApi {
  listLatestForTeam(teamId: string): Promise<AgentConversation[]>;
}

export default class AgentConversationsRestApi implements AgentConversationsApi {
  public constructor(private client: ApiClient) {}

  public async listLatestForTeam(teamId: string) {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set('teamId', teamId);

    return this.client.makeCall<AgentConversation[]>(`/agent-conversations?${urlSearchParams}`);
  }
}
