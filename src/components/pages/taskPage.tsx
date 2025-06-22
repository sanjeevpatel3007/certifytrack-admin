'use client';

import { useState, useEffect } from 'react';
import { getInternships } from '@/action/internship.action';
import { Task, getInternshipDuration } from '@/action/task.action';
import TaskList from '../task/TaskList';
import TaskFormModal from '../task/TaskFormModal';
import toast from 'react-hot-toast';

export default function TaskPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<string>('');
    const [internships, setInternships] = useState<any[]>([]);
    const [maxDay, setMaxDay] = useState<number>(1);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInternships();
    }, []);

    useEffect(() => {
        if (selectedInternship) {
            loadInternshipDuration();
        }
    }, [selectedInternship]);

    const loadInternships = async () => {
        try {
            const data = await getInternships();
            setInternships(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load internships');
            console.error('Error loading internships:', error);
            setLoading(false);
        }
    };

    const loadInternshipDuration = async () => {
        try {
            const duration = await getInternshipDuration(selectedInternship);
            setMaxDay(duration || 1);
        } catch (error) {
            console.error('Error loading internship duration:', error);
            setMaxDay(1);
        }
    };

    const handleCreateTask = () => {
        if (!selectedInternship) {
            toast.error('Please select an internship first');
            return;
        }
        setEditingTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
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
                    <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage tasks for internships</p>
                </div>
                <button 
                    onClick={handleCreateTask}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Task
                </button>
            </div>

            {/* Internship Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Internship</label>
                <select
                    value={selectedInternship}
                    onChange={(e) => setSelectedInternship(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="">Select an internship...</option>
                    {internships.map((internship) => (
                        <option key={internship.id} value={internship.id}>
                            {internship.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Task List */}
            {selectedInternship && (
                <TaskList
                    internshipId={selectedInternship}
                    onEdit={handleEditTask}
                />
            )}

            {/* Task Form Modal */}
            {selectedInternship && (
                <TaskFormModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTask(undefined);
                    }}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingTask(undefined);
                    }}
                    internshipId={selectedInternship}
                    maxDay={maxDay}
                    initialData={editingTask}
                />
            )}
        </div>
    );
} 