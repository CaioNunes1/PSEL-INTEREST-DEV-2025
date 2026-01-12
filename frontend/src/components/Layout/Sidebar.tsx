import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiHome, 
  HiUsers, 
  HiUserGroup, 
  HiChartBar,
  HiCog,
  HiLogout,
  HiMenu,
  HiX 
} from 'react-icons/hi';
import { cn } from '../../lib/utils';

interface SidebarProps {
  userEmail?: string;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userEmail, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HiHome },
    { name: 'Users', href: '/users', icon: HiUsers },
    { name: 'Teams', href: '/teams', icon: HiUserGroup },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-900 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative h-screen w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <HiUserGroup className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TeamSync</h1>
              <p className="text-xs text-gray-400">Team Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                )
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium">{userEmail || 'user@example.com'}</p>
              <p className="text-xs text-gray-400">{userRole || 'User'}</p>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors">
            <HiLogout className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};