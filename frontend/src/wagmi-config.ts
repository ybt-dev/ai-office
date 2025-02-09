import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask()],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default wagmiConfig;
