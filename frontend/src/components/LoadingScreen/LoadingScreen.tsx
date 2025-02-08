const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-transparent z-50">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-white animate-pulse">
        INITIALIZATION...
      </p>
    </div>
  );
};

export default LoadingScreen;
