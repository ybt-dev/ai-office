import {useState} from "react";
import {Outlet, useNavigate, useOutletContext, useParams} from "react-router";
import { Agent } from "~/api/AgentsApi";
import useListAgentsByTeamIdQuery from "~/hooks/queries/useListAgentsByTeamIdQuery";
import useCreateAgentMutation from "~/hooks/mutations/useCreateAgentMutation";
import AgentsList from "~/components/AgentsList";
import Popup from "~/components/Popup";
import AgentForm, { AgentFormData } from "~/components/AgentForm";

const Agents = () => {
  const teamId = useOutletContext<string>();

  const { agentId: selectedAgentId } = useParams<{ agentId: string }>();

  const navigate = useNavigate();

  const { data: agents } = useListAgentsByTeamIdQuery(teamId);

  const { mutateAsync: createAgent } = useCreateAgentMutation();

  const [displayCreateAgentPopup, setDisplayCreateAgentPopup] = useState(false);

  const showCreateAgentPopup = () => setDisplayCreateAgentPopup(true);
  const hideCreateAgentPopup = () => setDisplayCreateAgentPopup(false);

  const handleCreateAgentSubmit = async (data: AgentFormData) => {
    await createAgent({
      name: data.agentName,
      description: data.agentDescription,
      modelApiKey: data.modelApiKey,
      model: data.model,
      role: data.agentRole,
      config: {},
      teamId,
    });
  };

  const handleAgentClick = (agent: Agent) => {
    navigate(`/agent-teams/${teamId}/agents/${agent.id}`);
  };

  return (
    <div className="w-full h-full text-white">
      {agents && agents.length > 0 ? (
        <div className="flex flex-row p-2 rounded-xl bg-gray-800 gap-8">
          <AgentsList
            selectedAgentId={selectedAgentId || null}
            agents={agents}
            onAgentClick={handleAgentClick}
          />
          <div
            onClick={showCreateAgentPopup}
            className="flex flex-col items-center justify-center w-36 h-36 cursor-pointer p-2 rounded-full border-2 border-dashed border-gray-600 mt-2"
          >
            <span className="text-3xl font-bold text-green-500">+</span>
            <span className="mt-2 text-sm">Add Agent</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="mb-4 text-lg">No Agents</p>
          <button
            onClick={showCreateAgentPopup}
            className="bg-green-500 hover:bg-green-600 transition px-6 py-3 rounded"
          >
            Create Agent
          </button>
        </div>
      )}
      <Outlet />
      <Popup isOpen={displayCreateAgentPopup} onClose={hideCreateAgentPopup}>
        <AgentForm onSubmit={handleCreateAgentSubmit} actionName="Create Agent" />
      </Popup>
    </div>
  );
};

export default Agents;
