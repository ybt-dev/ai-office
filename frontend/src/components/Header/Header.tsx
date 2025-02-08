const Header = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <img className="h-fit mb-1" src="/logo.png" alt="logo" />
          <span className="text-xl font-semibold text-white">AI office</span>
        </div>
        <div className="flex items-center">
          <div>
            <img src="/avatar-mini.png" alt="avatar" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
