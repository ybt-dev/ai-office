import { useCallback } from 'react';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionsApi } from '@/providers/ApiProvider';

const useCreateSessionMutation = () => {
  const sessionsApi = useSessionsApi();

  const queryClient = useQueryClient();

  const handleMutationSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['session-user'] });
  }, [queryClient]);

  return useMutation<void, DefaultError, string>({
    mutationFn: (token: string) => sessionsApi.createSession(token),
    onSuccess: handleMutationSuccess,
  });
};

export default useCreateSessionMutation;
