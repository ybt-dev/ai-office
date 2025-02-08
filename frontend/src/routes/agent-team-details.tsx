import {Outlet, useNavigate, useParams} from "react-router";
import TeamManagementPanel from "~/components/TeamManagementPanel";
import useAgentTeamByIdQuery from "~/hooks/queries/useAgentTeamByIdQuery.ts";

const AgentTeamDetails = () => {
  const { agentTeamId } = useParams<{ agentTeamId: string }>();

  const navigate = useNavigate();

  const { data: currentAgentTeam } = useAgentTeamByIdQuery(agentTeamId || '');

  const handleSelectCategory = (category: string) => {
    navigate(`/agent-teams/${agentTeamId}/${category}`, { relative: 'path' });
  };

  return (
    <div className="flex flex-grow h-full">
      <TeamManagementPanel
        agentTeamName={currentAgentTeam?.name || ''}
        onSelectCategory={handleSelectCategory}
      />
      <div className="flex-grow p-6 overflow-auto border-t border-[#2F343D]">
        <h1 className="text-3xl font-bold">Agents:</h1>
        <div className="w-full h-full flex mt-6">
          <Outlet context={agentTeamId} />
        </div>
      </div>
    </div>
  );
};

export default AgentTeamDetails;
