import Skeleton from "@/components/Skeleton";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block rounded-lg bg-gray-800 p-3 mb-4">
          <svg className="h-12 w-12 text-purple-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading AI Office</h2>
        <Skeleton className="h-2 w-48 mx-auto mb-4" />
        <p className="text-gray-400">Please wait while we initialize your workspace...</p>
      </div>
    </div>
  )
};

export default LoadingScreen;
