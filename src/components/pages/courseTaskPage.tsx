'use client';

import { useState, useEffect } from 'react';
import { getCourses } from '@/action/course.action';
import { CourseTask, getCourseDuration } from '@/action/course-task.action';
import CourseTaskList from '../course-task/CourseTaskList';
import CourseTaskFormModal from '../course-task/CourseTaskFormModal';
import toast from 'react-hot-toast';

export default function CourseTaskPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [courses, setCourses] = useState<any[]>([]);
    const [maxDay, setMaxDay] = useState<number>(1);
    const [editingTask, setEditingTask] = useState<CourseTask | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            loadCourseDuration();
        }
    }, [selectedCourse]);

    const loadCourses = async () => {
        try {
            const data = await getCourses();
            setCourses(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load courses');
            console.error('Error loading courses:', error);
            setLoading(false);
        }
    };

    const loadCourseDuration = async () => {
        try {
            const duration = await getCourseDuration(selectedCourse);
            setMaxDay(duration || 1);
        } catch (error) {
            console.error('Error loading course duration:', error);
            setMaxDay(1);
        }
    };

    const handleCreateTask = () => {
        if (!selectedCourse) {
            toast.error('Please select a course first');
            return;
        }
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: CourseTask) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Task Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage tasks for courses</p>
                </div>
                <button 
                    onClick={handleCreateTask}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Task
                </button>
            </div>

            {/* Course Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select a course...</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Task List */}
            {selectedCourse && (
                <CourseTaskList
                    courseId={selectedCourse}
                    onEdit={handleEditTask}
                />
            )}

            {/* Task Form Modal */}
            {selectedCourse && (
                <CourseTaskFormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(undefined);
                    }}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingTask(undefined);
                    }}
                    courseId={selectedCourse}
                    maxDay={maxDay}
                    initialData={editingTask}
                />
            )}
        </div>
    );
} 