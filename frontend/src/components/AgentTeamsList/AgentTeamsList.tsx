import { AgentTeam } from "~/api/AgentTeamsApi";

export interface AgentTeamsListProps {
  agentTeams: AgentTeam[];
  onEditAgentTeamClick: (agentTeam: AgentTeam) => void;
}

const AgentTeamsList = ({ agentTeams, onEditAgentTeamClick }: AgentTeamsListProps) => {
  return (
    <div>
      {agentTeams.map((agentTeam) => {
        return (
          <div key={agentTeam.id} className="flex items-center justify-between bg-gray-800 p-4 rounded mb-2">
            <div>
              <p className="font-semibold text-lg">{agentTeam.name}</p>
              <p className="text-sm text-gray-400">{agentTeam.description}</p>
            </div>
            <button
              onClick={() => onEditAgentTeamClick(agentTeam)}
              className="px-3 py-2 bg-[#238636] text-white font-semibold rounded hover:bg-[#1e7331] transition-colors"
            >
              Edit
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AgentTeamsList;
