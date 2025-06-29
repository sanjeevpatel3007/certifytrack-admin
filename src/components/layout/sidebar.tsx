// components/layout/Sidebar.tsx
'use client'

import { signOutAction } from '@/action/auth.action';
import { useAuth } from '@/components/common/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const Sidebar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || 'overview';

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

  const getButtonClass = (page: string) => {
    const baseClass = "w-full text-left px-4 py-2 rounded transition-colors";
    return currentPage === page 
      ? `${baseClass} bg-indigo-50 text-indigo-700`
      : `${baseClass} hover:bg-gray-100`;
  };

  const navItems = [
    { name: 'Overview', href: '?page=overview' },
    { name: 'Internships', href: '?page=internship' },
    { name: 'Courses', href: '?page=course' },
    { name: 'Tasks', href: '?page=task' },
    { name: 'Course Tasks', href: '?page=course-task' },
    { name: 'Submissions', href: '?page=submission' },
    { name: 'Mentors', href: '?page=mentors' },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === item.href.split('=')[1]
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Signed in as:</p>
            <p className="font-medium truncate text-gray-900">{user?.email}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
