'use client';

import { useAuth } from '@/components/common/auth-provider';
import Sidebar from '@/components/layout/sidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import CertificateTemplatePage from '@/components/pages/certificateTemplatePage';
import InternshipPage from '@/components/pages/internshipPage';

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
        case 'certificate':
            content = <CertificateTemplatePage />;
            break;
        case 'internship':
            content = <InternshipPage />;
            break;
        default:
            content = (
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
                    <p className="text-gray-600">
                        Select a section from the sidebar to manage your content.
                    </p>
                </div>
            );
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50">
                {content}
            </main>
        </div>
    );
} 