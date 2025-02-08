import { useParams } from "react-router";
import useCreateAgentMutation from "~/hooks/mutations/useCreateAgentMutation";
import useAgentByIdQuery from "~/hooks/queries/useAgentByIdQuery";
import AgentForm from "~/components/AgentForm";

const AgentDetails = () => {
  const { agentId } = useParams<{ agentId: string; }>();

  const { data: agent } = useAgentByIdQuery(agentId || '');

  const { mutateAsync: createAgent } = useCreateAgentMutation();

  return (
    <div className="h-full p-8 text-white">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Agent Details for {agent?.name}:
      </h2>
      {agent ? (
        <AgentForm
          key={agent.id}
          existingAgent={agent}
          onSubmit={() => {}} actionName="Update Agent"
        />
      ) : null}
    </div>
  );
};

export default AgentDetails;
