// components/layout/Sidebar.tsx
'use client'

import { signOutAction } from '@/action/auth.action';
import { useAuth } from '@/components/common/auth-provider';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigation = (page: string) => {
    router.push(`/dashboard?page=${page}`);
  };

  const handleSignOut = async () => {
    try {
      await signOutAction();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => handleNavigation('overview')}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Overview
          </button>
          
          <button
            onClick={() => handleNavigation('certificate')}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Certificate Templates
          </button>
          
          <button
            onClick={() => handleNavigation('internship')}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Internships
          </button>
        </nav>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="px-4 py-2 mb-4">
            <p className="text-sm text-gray-600">Signed in as:</p>
            <p className="font-medium truncate">{user?.email}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
