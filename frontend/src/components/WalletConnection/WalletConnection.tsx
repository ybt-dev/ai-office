import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccount, useConnect } from 'wagmi';
import WalletOption from './WalletOption';

export interface WalletConnectionAttributes {
  isConnected: boolean;
  isOpen: boolean;
  address: string | undefined;
  setIsOpen: (isOpen: boolean) => void;
}
export interface WalletConnectionProps {
  children: (attributes: WalletConnectionAttributes) => ReactNode;
}

const WalletConnection = ({ children }: WalletConnectionProps) => {
  const navigate = useNavigate();
  const { connectors, connect } = useConnect();
  const { isConnected, address } = useAccount();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {children({
        isConnected,
        isOpen,
        address,
        setIsOpen,
      })}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {isConnected ? (
              <button
                onClick={() => navigate('/logout')}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 text-left"
              >
                Disconnect
              </button>
            ) : (
              connectors.map((connector) => (
                <WalletOption
                  key={connector.uid}
                  connector={connector}
                  onClick={() => {
                    connect({ connector });

                    setIsOpen(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
