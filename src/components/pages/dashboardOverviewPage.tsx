'use client';

// import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { BarChart2, Users, ClipboardList, BookOpen, Award, FileCheck } from 'lucide-react';
import { DashboardStats, getDashboardStats } from '@/action/dashboard.action';
import toast from 'react-hot-toast';

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalInternships: 0,
    totalTasks: 0,
    totalSubmissions: 0,
    totalCertificates: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Users',
      value: stats.totalUsers,
      icon: <Users className="w-5 h-5 text-indigo-600" />
    },
    {
      label: 'Courses',
      value: stats.totalCourses,
      icon: <BookOpen className="w-5 h-5 text-green-600" />
    },
    {
      label: 'Internships',
      value: stats.totalInternships,
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />
    },
    {
      label: 'Tasks',
      value: stats.totalTasks,
      icon: <BarChart2 className="w-5 h-5 text-yellow-600" />
    },
    {
      label: 'Submissions',
      value: stats.totalSubmissions,
      icon: <FileCheck className="w-5 h-5 text-purple-600" />
    },
    {
      label: 'Certificates',
      value: stats.totalCertificates,
      icon: <Award className="w-5 h-5 text-pink-600" />
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shadow rounded-xl">
              <div className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="shadow rounded-xl">
            <div className="p-4 flex items-center gap-4">
              {card.icon}
              <div>
                <div className="text-lg font-semibold text-gray-800">{card.value}</div>
                <div className="text-sm text-gray-500">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
