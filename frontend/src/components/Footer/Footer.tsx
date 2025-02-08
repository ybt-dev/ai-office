import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#151b23] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="typography-h6">Office AI</h3>
            <p className="typography-body2">
              Empowering your business with AI solutions
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="/privacy" className="typography-body2 hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="/terms" className="typography-body2 hover:text-gray-400">
              Terms of Service
            </a>
            <a href="/contact" className="typography-body2 hover:text-gray-400">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-4 text-center typography-caption text-gray-400">
          © {new Date().getFullYear()} Office AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
