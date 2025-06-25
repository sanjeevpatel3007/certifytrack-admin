'use client';

import { Course, getCourses } from '@/action/course.action';
import { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import toast from 'react-hot-toast';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCourses();
            setCourses(data);
        } catch (error) {
            const errorMessage = 'Failed to load courses';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md mx-auto">
                        <p className="mb-2">{error}</p>
                        <button 
                            onClick={loadCourses}
                            className="text-red-600 underline hover:no-underline"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first course.</p>
                    <div className="text-sm text-gray-400">
                        <p>Courses help you organize and deliver structured learning content</p>
                        <p>with certificates and progress tracking.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Courses</p>
                            <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Published</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {courses.filter(course => course.is_published).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Drafts</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {courses.filter(course => !course.is_published).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">With Certificates</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {courses.filter(course => course.certificate_template && 
                                    (course.certificate_template.completion || course.certificate_template.course)).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onDelete={loadCourses}
                    />
                ))}
            </div>
        </div>
    );
} 