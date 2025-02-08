import React from 'react';

const Header = () => {
  return (
    <header className="text-white px-12 py-6 flex justify-between items-center">
      <div className="flex flex-row items-center gap-4">
        <img className="h-fit mb-1" src="/logo.png" alt="logo" />
        <h3 className="typography-h3 text-white">
          AI office
        </h3>
      </div>
      <div>
        <img src="/avatar-mini.png" alt="avatar" className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
};

export default Header;
