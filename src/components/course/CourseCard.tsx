'use client';

import { Course, deleteCourse } from '@/action/course.action';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CourseCardProps {
    course: Course;
    onDelete: () => void;
}

export default function CourseCard({ course, onDelete }: CourseCardProps) {
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Course Image */}
            <div className="relative h-48 bg-gray-100">
                {course.image_url ? (
                    <Image
                        src={course.image_url}
                        alt={course.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                {/* Course Details */}
                <div className="space-y-2 text-sm text-gray-600">
                    {course.category && (
                        <div className="flex items-center">
                            <span className="font-medium mr-2">Category:</span>
                            <span>{course.category}</span>
                        </div>
                    )}
                    {course.duration_days && (
                        <div className="flex items-center">
                            <span className="font-medium mr-2">Duration:</span>
                            <span>{course.duration_days} days</span>
                        </div>
                    )}
                    {course.difficulty && (
                        <div className="flex items-center">
                            <span className="font-medium mr-2">Difficulty:</span>
                            <span className="capitalize">{course.difficulty}</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {course.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Status Badge */}
                <div className="mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        course.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {course.is_published ? 'Published' : 'Draft'}
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => {/* TODO: Implement edit */}}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
} 