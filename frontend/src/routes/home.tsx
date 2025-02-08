const Home = () => {
  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center gap-16">
        <div className="p-4 mb-4 max-w-[920px] z-1">
          <h1 className="text-4xl font-bold text-center">
            AI Office
          </h1>
          <h3 className="text-4xl font-bold text-center">
            Automate tasks, enhance collaboration, and unlock new possibilities with intelligent AI agents.
          </h3>
        </div>
        <div className="flex flex-col">
          <button className="p-4 bg-[#482F8A]">
            Join AI Office
          </button>
        </div>
      </div>
      <img className="fixed bottom-0 h-full" src="/grid.png" alt="grid" />
      <img className="fixed bottom-0" src="/blur-1.png" alt="blur-1" />
      <img className="fixed bottom-0 w-48" src="/robot.png" alt="robot" />
    </div>
  );
};

export default Home;
