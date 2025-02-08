import { useState } from "react";
import { useNavigate } from "react-router";
import { AgentTeam } from "~/api/AgentTeamsApi";
import useListAgentTeamsQuery from "~/hooks/queries/useListAgentTeamsQuery";
import useCreateAgentTeamMutation from "~/hooks/mutations/useCreateAgentTeamMutation";
import AgentTeamsList from "~/components/AgentTeamsList";
import AgentTeamForm, { AgentTeamFormData } from "~/components/AgentTeamForm";
import Popup from "~/components/Popup";

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

  const renderContent = () => {
    if (!agentTeams) {
      return (
        <p>Loading...</p>
      );
    }

    if (agentTeams.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="mb-4 text-lg">No Agent Teams</p>
          <button
            onClick={showCreateAgentTeamPopup}
            className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded"
          >
            Create Agent Team
          </button>
        </div>
      );
    }

    return (
      <AgentTeamsList
        agentTeams={agentTeams}
        onEditAgentTeamClick={handleEditAgentTeamClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0712] p-8 text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Agent Teams</h1>
        <button
          onClick={showCreateAgentTeamPopup}
          className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded"
        >
          Add Agent Team
        </button>
      </div>
      {renderContent()}
      <Popup
        isOpen={displayCreateAgentTeamPopup}
        onClose={closeCreateAgentTeamPopup}
      >
        <AgentTeamForm onSubmit={handleSubmitCreateAgentForm} />
      </Popup>
    </div>
  );
};

export default AgentTeamsPage;
