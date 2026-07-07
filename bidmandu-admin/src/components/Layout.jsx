import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar />
      <main className="flex-grow overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}