'use client';

import { deleteInternship } from '@/action/internship.action';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface InternshipStats {
    total_students: number;
    active_students: number;
    completed_students: number;
    total_tasks: number;
    total_submissions: number;
    pending_submissions: number;
    approved_submissions: number;
    rejected_submissions: number;
    mandatory_tasks: number;
    tasks_by_difficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
}

interface InternshipCardProps {
    internship: {
        id: string;
        title: string;
        description: string | null;
        organization_name: string | null;
        image_url: string | null;
        status: string;
        is_published: boolean;
        mode: string;
        duration_days: number | null;
        price_type: string;
        price_value: number;
        mentors: string[] | null;
        stats?: InternshipStats;
        internship_certificates?: {
            certificate_templates: {
                id: string;
                name: string;
            };
        }[];
    };
    onDelete: () => void;
    onEdit: (internship: any) => void;
}

export default function InternshipCard({ internship, onDelete, onEdit }: InternshipCardProps) {
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            {/* Banner Image */}
            <div className="relative h-40">
                {internship.image_url ? (
                    <Image
                        src={internship.image_url}
                        alt={internship.title}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                        {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                    </span>
                    {internship.is_published && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                            Published
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                {/* Header - Always Visible */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{internship.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {internship.organization_name || 'No organization'}
                    </p>
                </div>

                {/* Basic Info - Always Visible */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {internship.mode}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {internship.duration_days || 0} days
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {internship.price_type === 'free' ? 'Free' : `$${internship.price_value}`}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {internship.mentors?.length || 0} mentors
                    </div>
                </div>

                {/* Quick Stats - Always Visible */}
                <div className="flex justify-between items-center mb-3 text-sm">
                    <div className="flex space-x-4">
                        <span className="text-gray-500">
                            <span className="font-medium text-gray-900">{internship.stats?.total_students || 0}</span> students
                        </span>
                        <span className="text-gray-500">
                            <span className="font-medium text-gray-900">{internship.stats?.total_tasks || 0}</span> tasks
                        </span>
                        <span className="text-gray-500">
                            <span className="font-medium text-gray-900">{internship.stats?.total_submissions || 0}</span> submissions
                        </span>
                    </div>
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                    {isExpanded ? (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show More
                        </>
                    )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="border-t border-gray-100 pt-3 mt-3 space-y-4">
                        {/* Description */}
                        {internship.description && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                                <p className="text-sm text-gray-600">{internship.description}</p>
                            </div>
                        )}

                        {/* Detailed Stats */}
                        {internship.stats && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Detailed Statistics</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-2">Students</p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span>Total:</span>
                                                <span className="font-medium">{internship.stats.total_students}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Active:</span>
                                                <span className="font-medium">{internship.stats.active_students}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Completed:</span>
                                                <span className="font-medium">{internship.stats.completed_students}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-2">Tasks</p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <span>Total:</span>
                                                <span className="font-medium">{internship.stats.total_tasks}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Mandatory:</span>
                                                <span className="font-medium">{internship.stats.mandatory_tasks}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Difficulty:</span>
                                                <span className="font-medium">
                                                    {internship.stats.tasks_by_difficulty.easy}/{internship.stats.tasks_by_difficulty.medium}/{internship.stats.tasks_by_difficulty.hard}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500 mb-2">Submissions</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex justify-between">
                                                <span>Total:</span>
                                                <span className="font-medium">{internship.stats.total_submissions}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Pending:</span>
                                                <span className="font-medium">{internship.stats.pending_submissions}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Approved:</span>
                                                <span className="font-medium">{internship.stats.approved_submissions}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rejected:</span>
                                                <span className="font-medium">{internship.stats.rejected_submissions}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Certificates */}
                        {internship.internship_certificates && internship.internship_certificates.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Certificates</h4>
                                <div className="flex flex-wrap gap-2">
                                    {internship.internship_certificates.map((cert) => (
                                        <span
                                            key={cert.certificate_templates.id}
                                            className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200"
                                        >
                                            {cert.certificate_templates.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => onEdit(internship)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-150"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 