import React from 'react';

const Button = ({ children }) => {
  return (
    <button className="px-6 py-3 rounded-lg font-semibold text-white bg-[linear-gradient(90.2deg,#ffc312_.19%,#ee9236_100.55%)] hover:bg-[linear-gradient(90.2deg,#ffc312_.19%,#ff70af_100.55%)] transition-colors duration-300 shadow-md hover:shadow-lg">
      {children}
    </button>
  );
};

export default Button;
