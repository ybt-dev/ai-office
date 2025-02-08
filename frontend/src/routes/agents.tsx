import {useState} from "react";
import { Plus } from "lucide-react"
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router";
import { Agent } from "@/api/AgentsApi";
import useListAgentsByTeamIdQuery from "@/hooks/queries/useListAgentsByTeamIdQuery";
import useCreateAgentMutation from "@/hooks/mutations/useCreateAgentMutation";
import AgentsList from "@/components/AgentsList";
import Popup from "@/components/Popup";
import AgentForm, { AgentFormData } from "@/components/AgentForm";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Agents:</h1>
        <button
          disabled={!agents}
          onClick={showCreateAgentPopup}
          className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Agent
        </button>
      </div>
      <AgentsList
        selectedAgentId={selectedAgentId || null}
        agents={agents ?? null}
        onAgentClick={handleAgentClick}
      />
      <Outlet key={selectedAgentId} />
      <Popup title="Create New Agent" isOpen={displayCreateAgentPopup} onClose={hideCreateAgentPopup}>
        <AgentForm onSubmit={handleCreateAgentSubmit} actionName="Create Agent" />
      </Popup>
    </div>
  );
};

export default Agents;
