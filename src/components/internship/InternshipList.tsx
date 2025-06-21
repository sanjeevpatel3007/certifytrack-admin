'use client';

import { getInternships } from '@/action/internship.action';
import { useEffect, useState } from 'react';
import InternshipCard from './InternshipCard';
import toast from 'react-hot-toast';

interface InternshipListProps {
    onEdit: (internship: any) => void;
}

export default function InternshipList({ onEdit }: InternshipListProps) {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadInternships = async () => {
        try {
            const data = await getInternships();
            setInternships(data);
        } catch (error) {
            toast.error('Failed to load internships');
            console.error('Error loading internships:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInternships();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (internships.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No internships found.</p>
                <p className="text-gray-500 text-sm mt-2">Create your first internship to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {internships.map((internship) => (
                <InternshipCard
                    key={internship.id}
                    internship={internship}
                    onDelete={loadInternships}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
} 