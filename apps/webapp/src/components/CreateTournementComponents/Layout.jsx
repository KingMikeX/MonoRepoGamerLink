// 1. /components/Layout.jsx - Hauptlayout der Anwendung
import React from 'react';
import { useRouter } from 'next/navigation';
import FullSideBar from '../FullSideBar';

const Layout = ({ children }) => {
  const router = useRouter();
  
  return (
    <div className="flex bg-[#252641] h-screen text-white">
      {/* Sidebar */}
      <FullSideBar which_Page={2} />
      {/* Page Content */}
      <div className="flex-1 p-4 overflow-auto font-semibold">
        {children}
      </div>
    </div>
  );
};

export default Layout;