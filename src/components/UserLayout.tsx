import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const UserLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;