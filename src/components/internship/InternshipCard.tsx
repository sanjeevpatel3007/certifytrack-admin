'use client';

import { deleteInternship } from '@/action/internship.action';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface InternshipCardProps {
    internship: any;
    onDelete: () => void;
    onEdit: (internship: any) => void;
}

export default function InternshipCard({ internship, onDelete, onEdit }: InternshipCardProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this internship?')) return;
        
        setLoading(true);
        try {
            await deleteInternship(internship.id);
            toast.success('Internship deleted successfully');
            onDelete();
        } catch (error) {
            toast.error('Failed to delete internship');
            console.error('Error deleting internship:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800';
            case 'ongoing':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Banner Image */}
            <div className="relative w-full h-48">
                {internship.image_url ? (
                    <Image
                        src={internship.image_url}
                        alt={internship.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No banner image</span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                        <p className="text-sm text-gray-500">
                            {internship.organization_name || 'No organization'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                            {internship.status}
                        </span>
                        {internship.is_published && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Published
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">{internship.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{internship.mode}</span>
                        <span>•</span>
                        <span>{internship.duration_days} days</span>
                        <span>•</span>
                        <span>{internship.price_type === 'free' ? 'Free' : `$${internship.price_value}`}</span>
                    </div>

                    {internship.internship_certificates?.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Certificates:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {internship.internship_certificates.map((cert: any) => (
                                    <span
                                        key={cert.certificate_id}
                                        className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded"
                                    >
                                        {cert.certificate_templates.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                    <button
                        onClick={() => onEdit(internship)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
} 