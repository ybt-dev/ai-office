import { useQuery } from '@tanstack/react-query';
import { useAgentTeamsApi } from '~/providers/ApiProvider';

const useAgentTeamByIdQuery = (agentTeamId: string) => {
  const agentTeamsApi = useAgentTeamsApi();

  return useQuery({
    queryKey: ['agents-conversations', agentTeamId],
    queryFn: () => agentTeamsApi.getAgentTeamById(agentTeamId),
  });
};

export default useAgentTeamByIdQuery;
