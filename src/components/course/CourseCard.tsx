'use client';

import { Course, deleteCourse } from '@/action/course.action';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseCardProps {
    course: Course;
    onDelete: () => void;
    onEdit?: (course: Course) => void;
}

export default function CourseCard({ course, onDelete, onEdit }: CourseCardProps) {
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        setLoading(true);
        try {
            await deleteCourse(course.id);
            toast.success('Course deleted successfully');
            onDelete();
        } catch (error) {
            toast.error('Failed to delete course');
            console.error('Error deleting course:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Course Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {course.image_url ? (
                    <Image
                        src={course.image_url}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="text-xs text-gray-500">No image</p>
                        </div>
                    </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {course.is_published ? 'Published' : 'Draft'}
                    </span>
                </div>

                {/* Difficulty Badge */}
                {course.difficulty && (
                    <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="p-5">
                {/* Header */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
                        {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {course.description || 'No description available'}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                        {course.duration_days && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {course.duration_days} days
                            </div>
                        )}
                        {course.category && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {course.category}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {course.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-200"
                            >
                                {tag}
                            </span>
                        ))}
                        {course.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                                +{course.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

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
                    <div className="border-t border-gray-100 pt-3 mt-3 space-y-3">
                        {/* Mentors */}
                        {course.mentors && course.mentors.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Mentors</h4>
                                <div className="flex flex-wrap gap-1">
                                    {course.mentors.map((mentor, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                                        >
                                            {mentor}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        {course.features && course.features.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Features</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    {course.features.slice(0, 3).map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                    {course.features.length > 3 && (
                                        <li className="text-gray-500">+{course.features.length - 3} more features</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Certificates */}
                        {course.certificate_template && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">Certificates</h4>
                                <div className="flex flex-wrap gap-1">
                                    {course.certificate_template.completion && (
                                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                                            {course.certificate_template.completion.title || 'Completion Certificate'}
                                        </span>
                                    )}
                                    {course.certificate_template.course && (
                                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                                            {course.certificate_template.course.title || 'Course Certificate'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(course)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            )}
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