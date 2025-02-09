import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import useCreateSessionMutation from '@/hooks/mutations/useCreateSessionMutation';
import useCreateSessionNonceMutation from '@/hooks/mutations/useCreateSessionNonceMutation';
import useSession from '@/hooks/useSession';

const useSignIn = () => {
  const { address, isConnected, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [currentUser] = useSession();

  const currentUserId = currentUser && currentUser.id;

  const { mutateAsync: createSessionNonce } = useCreateSessionNonceMutation();
  const { mutateAsync: createSession } = useCreateSessionMutation();

  useAsyncEffect(async () => {
    if (!isConnected || !chainId || !address || currentUserId !== null) {
      return;
    }

    try {
      const nonce = await createSessionNonce(address);

      // TODO Handle case with non loaded providers.
      const message = new SiweMessage({
        address,
        nonce,
        chainId,
        domain: window.location.host,
        statement: 'Sign in with Ethereum to the ai-office app.',
        uri: window.location.origin,
        version: '1',
      });

      const preparedMessage = message.prepareMessage();

      const signature = await signMessageAsync({ message: preparedMessage });

      await createSession({
        signature,
        message: preparedMessage,
        nonce,
      });
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  }, [currentUserId, address, isConnected, chainId]);
};

export default useSignIn;
