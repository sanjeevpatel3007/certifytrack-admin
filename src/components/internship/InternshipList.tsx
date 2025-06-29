'use client';

import { useEffect, useState } from 'react';
import { getInternships, getInternshipById, deleteInternship, Internship } from '@/action/internship.action';
import InternshipCard from './InternshipCard';

interface Props {
    onEdit: (internship: Internship) => void;
}

export default function InternshipList({ onEdit }: Props) {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // First get basic internship data
            const basicData = await getInternships();
            if (!basicData) {
                setInternships([]);
                return;
            }

            // Then fetch detailed data for each internship
            const detailedData = await Promise.all(
                basicData.map(internship => getInternshipById(internship.id))
            );

            setInternships(detailedData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch internships');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this internship?')) return;
        try {
            await deleteInternship(id);
            await fetchInternships();
        } catch (err) {
            console.error('Error deleting internship:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                    <button onClick={fetchInternships} className="ml-4 underline hover:no-underline">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (internships.length === 0) {
        return (
            <div className="text-center py-12">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No internships</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new internship.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="grid grid-cols-1  gap-6 p-6">
                {internships.map((internship) => (
                    <InternshipCard
                        key={internship.id}
                        internship={internship}
                        onDelete={fetchInternships}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    );
} 