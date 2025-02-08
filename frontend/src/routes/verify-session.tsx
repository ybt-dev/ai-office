import { useNavigate, Navigate } from "react-router";
import useCreateSessionMutation from "~/hooks/mutations/useCreateSessionMutation";
import LoadingScreen from "~/components/LoadingScreen";
import useQueryParam from "~/hooks/useQueryParam";
import useAsyncEffect from "~/hooks/useAsyncEffect";

const VerifySessionPage = () => {
  const sessionToken = useQueryParam('token');

  const navigate = useNavigate();

  const { mutateAsync: createSession } = useCreateSessionMutation();

  useAsyncEffect(async () => {
    if (!sessionToken) {
      return;
    }

    await createSession(sessionToken);

    navigate('/agent-teams', { replace: true });
  }, [sessionToken]);

  if (!sessionToken) {
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    <LoadingScreen />
  );
};

export default VerifySessionPage;
