'use client';

import { useAuth } from '@/components/common/auth-provider';
import Sidebar from '@/components/layout/sidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import InternshipPage from '@/components/pages/internshipPage';
import CoursePage from './coursePage';
import TaskPage from './taskPage';
import CourseTaskPage from './courseTaskPage';
import DashboardOverview from './dashboardOverviewPage';
import SubmissionPage from './submissionPage';

export default function DashboardContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || 'overview';

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    let content;
    switch (page) {
        case 'internship':
            content = <InternshipPage />;
            break;
        case 'course':
            content = <CoursePage />;
            break;
        case 'task':
            content = <TaskPage />;
            break;
        case 'course-task':
            content = <CourseTaskPage />;
            break;
        case 'submission':
            content = <SubmissionPage />;
            break;
        default:
            content = <DashboardOverview />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="pl-64">
                {content}
            </main>
        </div>
    );
} 