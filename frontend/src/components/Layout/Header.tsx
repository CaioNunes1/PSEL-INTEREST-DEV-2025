import React, { useState } from 'react';
import { HiMenu, HiBell, HiUserCircle } from 'react-icons/hi';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
          >
            <HiMenu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Team Manager
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <HiBell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-3">
            <HiUserCircle className="w-8 h-8 text-gray-400" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">Administrador</p>
              <p className="text-xs text-gray-500">admin@email.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;