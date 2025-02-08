import { Agent } from "~/api/AgentsApi";

export interface AgentListProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onAgentClick: (agent: Agent) => void;
}

const AgentsList = ({ selectedAgentId, agents, onAgentClick }: AgentListProps) => {
  return (
    <div className="flex overflow-x-auto gap-5">
      {agents.map((agent) => {
        const isSelected = agent.id === selectedAgentId;
        return (
          <div
            key={agent.id}
            className="flex flex-col items-center cursor-pointer p-2 rounded"
            onClick={() => onAgentClick(agent)}
          >
            <img
              src={agent.imageUrl}
              alt={agent.name}
              className={`w-36 h-36 rounded-full object-cover border-2 ${isSelected ? "border-blue-500" : "border-gray-600"}`}
            />
            <span className="mt-2 text-white text-xl font-medium">{agent.name}</span>
            <span className="text-gray-400 text-sm">{agent.role}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AgentsList;
