import WalletConnection from '@/components/WalletConnection';

const Home = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center gap-2 z-1">
        <div className="p-4 mb-4 max-w-[780px] mt-24">
          <h1 className="text-5xl uppercase font-bold text-center">AI Office</h1>
          <h3 className="text-3xl mt-10 font-bold text-center">
            Automate tasks, enhance collaboration, and unlock new possibilities with intelligent{' '}
            <span className="text-[#976FFF]">AI Agents</span>.
          </h3>
        </div>
        <div className="flex flex-col">
          <WalletConnection>
            {({ setIsOpen }) => (
              <button onClick={() => setIsOpen(true)} className="p-4 rounded text-white text-bold bg-[#482F8A]">
                Join AI Office
              </button>
            )}
          </WalletConnection>
        </div>
      </div>
      <img className="fixed bottom-0 h-full" src="/grid.png" alt="grid" />
      <img className="fixed bottom-0" src="/blur-1.png" alt="blur-1" />
      <img className="fixed bottom-0 w-48 md:w-auto" src="/robot.png" alt="robot" />
    </div>
  );
};

export default Home;
