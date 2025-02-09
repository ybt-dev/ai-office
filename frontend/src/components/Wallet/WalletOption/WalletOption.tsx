import { useState } from 'react';
import { Connector } from 'wagmi';
import useAsyncEffect from '@/hooks/useAsyncEffect.ts';

export interface WalletOptionProps {
  connector: Connector;
  onClick: () => void;
}

const WalletOption = ({ connector, onClick }: WalletOptionProps) => {
  const [ready, setReady] = useState(false);

  useAsyncEffect(async () => {
    const provider = await connector.getProvider();
    setReady(!!provider);
  }, [connector]);

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-left"
    >
      {connector.name}
    </button>
  );
};

export default WalletOption;
