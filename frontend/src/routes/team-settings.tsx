import { useState } from "react";
import { useParams } from "react-router";
import useAgentTeamByIdQuery from "@/hooks/queries/useAgentTeamByIdQuery";
import AgentTeamForm from "@/components/AgentTeamForm";
import AgentTeamSettingsOverview from "@/components/AgentTeamSettingsOverview";

const TeamSettings = () => {
  const [showEditMode, setShowEditMode] = useState(false);

  const { agentTeamId } = useParams<{ agentTeamId: string }>();

  const { data: agentTeam } = useAgentTeamByIdQuery(agentTeamId || '');

  const renderContent = () => {
    if (!agentTeam) {
      return (
        <div>Loading...</div>
      );
    }

    if (showEditMode) {
      return (
        <AgentTeamForm
          existingAgentTeam={agentTeam}
          onSubmit={() => {}}
        />
      );
    }

    return (
      <AgentTeamSettingsOverview
        agentTeam={agentTeam}
        onEditButtonClick={() => setShowEditMode(true)}
      />
    );
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default TeamSettings;
