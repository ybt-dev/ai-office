import { Navigate, Outlet, useNavigate, useParams } from "react-router";
import useAgentTeamByIdQuery from "@/hooks/queries/useAgentTeamByIdQuery";
import TeamCategoryId from "@/enums/TeamCategoryId";
import TeamManagementPanel from "@/components/TeamManagementPanel";

const AgentTeamDetails = () => {
  const {
    agentTeamId,
    category,
  } = useParams<{ agentTeamId: string, category: TeamCategoryId; }>();

  const navigate = useNavigate();

  const { data: currentAgentTeam } = useAgentTeamByIdQuery(agentTeamId || '');

  const handleSelectCategory = (categoryId: TeamCategoryId) => {
    navigate(`/agent-teams/${agentTeamId}/${categoryId}`);
  };

  const handleGoBackButtonClick = () => {
    navigate('/agent-teams');
  };

  return (
    <div className="flex flex-grow h-full">
      <TeamManagementPanel
        selectedCategory={category}
        agentTeamName={currentAgentTeam?.name || ''}
        onSelectCategory={handleSelectCategory}
        onGoBackButtonClick={handleGoBackButtonClick}
      />
      <div className="flex-grow p-6 overflow-auto border-t border-[#2F343D]">
        <Outlet context={agentTeamId} />
      </div>
    </div>
  );
};

export default AgentTeamDetails;
