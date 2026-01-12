import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
};