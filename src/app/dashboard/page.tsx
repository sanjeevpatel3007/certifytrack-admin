'use client';

import { Suspense } from 'react';
import DashboardContent from '@/components/pages/DashboardContent';

export default function DashboardPageWrapper() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>}>
            <DashboardContent />
        </Suspense>
    );
}