import {toast} from "react-toastify";
import {useCallback} from "react";
import { DefaultError, useMutation } from '@tanstack/react-query';
import { useSessionsApi } from '@/providers/ApiProvider';

const useSendSessionLinkMutation = () => {
  const sessionsApi = useSessionsApi();

  const handleSuccess = useCallback(() => {
    toast('Session link sent successfully to your email!');
  }, []);

  return useMutation<void, DefaultError, string>({
    mutationFn: (email) => sessionsApi.sendSessionLink(email),
    onSuccess: handleSuccess,
  });
};

export default useSendSessionLinkMutation;
