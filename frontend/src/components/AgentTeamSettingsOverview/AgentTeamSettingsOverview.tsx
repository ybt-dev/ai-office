import { AgentTeam } from "@/api/AgentTeamsApi";

export interface AgentTeamSettingsOverviewProps {
  agentTeam: AgentTeam;
  onEditButtonClick: () => void;
}

const AgentTeamSettingsOverview = ({
  agentTeam,
  onEditButtonClick,
}: AgentTeamSettingsOverviewProps) => {
  return (
    <div className="rounded-lg bg-gray-800 text-gray-100 overflow-hidden">
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-xl font-semibold">Team Settings</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Team Name</h3>
            <p className="mt-1 text-lg">{agentTeam.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Description</h3>
            <p className="mt-1 text-lg">{agentTeam.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Strategy</h3>
            <p className="mt-1 text-lg">{agentTeam.strategy}</p>
          </div>
        </div>
        <button
          onClick={onEditButtonClick}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default AgentTeamSettingsOverview;
