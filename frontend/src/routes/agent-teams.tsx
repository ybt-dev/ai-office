import { useState } from "react";
import { useNavigate } from "react-router";
import { AgentTeam } from "@/api/AgentTeamsApi";
import { AgentTeamFormData } from "@/components/AgentTeamForm";
import useListAgentTeamsQuery from "@/hooks/queries/useListAgentTeamsQuery";
import useCreateAgentTeamMutation from "@/hooks/mutations/useCreateAgentTeamMutation";
import AgentTeamsGrid from "@/components/AgentTeamsGrid";
import Popup from "@/components/Popup";
import CreateAgentTeamForm from "@/components/CreateAgentTeamForm";

const AgentTeamsPage = () => {
  const [
    displayCreateAgentTeamPopup,
    setDisplayCreateAgentTeamPopup,
  ] = useState(false);

  const navigate = useNavigate();

  const { data: agentTeams } = useListAgentTeamsQuery();

  const { mutateAsync: createAgentTeam } = useCreateAgentTeamMutation();

  const handleSubmitCreateAgentForm = async (data: AgentTeamFormData) => {
    await createAgentTeam({
      description: data.description,
      name: data.name,
      strategy: data.strategy,
    });
  };

  const closeCreateAgentTeamPopup = () => {
    setDisplayCreateAgentTeamPopup(false);
  };

  const showCreateAgentTeamPopup = () => {
    setDisplayCreateAgentTeamPopup(true);
  };

  const handleEditAgentTeamClick = (agentTeam: AgentTeam) => {
    navigate(`/agent-teams/${agentTeam.id}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Agent Teams:</h1>
        <button
          onClick={showCreateAgentTeamPopup}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Add Agent Team
        </button>
      </div>

      <AgentTeamsGrid
        agentTeams={agentTeams ?? null}
        onEditAgentTeamClick={handleEditAgentTeamClick}
      />

      <Popup
        title="Create New Team"
        isOpen={displayCreateAgentTeamPopup}
        onClose={closeCreateAgentTeamPopup}
      >
        <CreateAgentTeamForm onSubmit={handleSubmitCreateAgentForm} />
      </Popup>
    </div>
  );
};

export default AgentTeamsPage;
