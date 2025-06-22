'use client';

import { useState } from 'react';
import CourseList from '../course/CourseList';
import CourseFormModal from '../course/CourseFormModal';

export default function CoursePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your courses and their certificates</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Course
                </button>
            </div>
            
            <CourseList />
            
            <CourseFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
} 