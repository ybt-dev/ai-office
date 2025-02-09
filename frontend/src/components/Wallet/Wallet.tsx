import { useState } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import WalletOption from './WalletOption';

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const Wallet = () => {
  const navigate = useNavigate();
  const { connectors, connect } = useConnect();
  const { isConnected, address } = useAccount();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 ease-in-out"
      >
        {isConnected ? truncateAddress(address!) : 'Connect Wallet'}
      </button>

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

export default Wallet;
