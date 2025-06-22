'use client';

import { Course, getCourses } from '@/action/course.action';
import { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import toast from 'react-hot-toast';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCourses = async () => {
        try {
            const data = await getCourses();
            setCourses(data);
        } catch (error) {
            toast.error('Failed to load courses');
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
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No courses found.</p>
                <p className="text-gray-500 text-sm mt-2">Create your first course to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={loadCourses}
                />
            ))}
        </div>
    );
} 