import { useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router';
import useLogoutMutation from '@/hooks/mutations/useLogoutMutation';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import LoadingScreen from '@/components/LoadingScreen';

const Logout = () => {
  const { disconnectAsync } = useDisconnect();
  const { mutateAsync: logout } = useLogoutMutation();
  const navigate = useNavigate();

  useAsyncEffect(async () => {
    await disconnectAsync();
    await logout(undefined);

    navigate('/');
  }, [disconnectAsync, logout]);

  return <LoadingScreen />;
};

export default Logout;
