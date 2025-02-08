export interface AgentConversationDto {
  id: string;
  teamId: string;
  sourceAgentId: string;
  targetAgentId: string;
  organizationId: string;
  content: string;
  createdAt: Date;
}
