import { useParams } from "react-router";
import { useState } from "react";
import useUpdateAgentMutation from "@/hooks/mutations/useUpdateAgentMutation";
import useAgentByIdQuery from "@/hooks/queries/useAgentByIdQuery";
import AgentForm from "@/components/AgentForm";
import AgentDetailsOverview from "@/components/AgentDetailsOverview";

const AgentDetails = () => {
  const [showEditMode, setShowEditMode] = useState(false);

  const { agentId } = useParams<{ agentId: string; }>();

  const { data: agent } = useAgentByIdQuery(agentId || '');

  const { mutateAsync: updatedAgent } = useUpdateAgentMutation();

  return (
    <div className="h-full text-white">
      {showEditMode && agent ? (
        <AgentForm
          agent={agent}
          onSubmit={() => {}}
        />
      ) : (
        <AgentDetailsOverview
          agent={agent ?? null}
          onEditButtonClick={() => setShowEditMode(true)}
        />
      )}
    </div>
  );
};

export default AgentDetails;
