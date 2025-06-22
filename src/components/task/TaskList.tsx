'use client';

import { Task, deleteTask, getTasksByInternship } from '@/action/task.action';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface TaskListProps {
    internshipId: string;
    onEdit: (task: Task) => void;
}

export default function TaskList({ internshipId, onEdit }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        try {
            const data = await getTasksByInternship(internshipId);
            setTasks(data);
        } catch (error) {
            toast.error('Failed to load tasks');
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [internshipId]);

    const handleDelete = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await deleteTask(taskId);
            toast.success('Task deleted successfully');
            loadTasks();
        } catch (error) {
            toast.error('Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No tasks found.</p>
                <p className="text-gray-500 text-sm mt-2">Create your first task to get started.</p>
            </div>
        );
    }

    // Group tasks by day
    const tasksByDay = tasks.reduce((acc, task) => {
        const day = task.assigned_day;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(task);
        return acc;
    }, {} as Record<number, Task[]>);

    return (
        <div className="space-y-6">
            {Object.entries(tasksByDay).map(([day, dayTasks]) => (
                <div key={day} className="bg-white rounded-lg shadow">
                    <div className="px-4 py-3 bg-gray-50 rounded-t-lg">
                        <h3 className="text-lg font-medium text-gray-900">Day {day}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {dayTasks.map((task) => (
                            <div key={task.id} className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-base font-medium text-gray-900">{task.title}</h4>
                                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                                        
                                        {/* Task Details */}
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                task.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                                                task.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {task.difficulty_level}
                                            </span>
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {task.estimated_time_hrs} hours
                                            </span>
                                            {task.is_mandatory && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                                    Mandatory
                                                </span>
                                            )}
                                        </div>

                                        {/* Tags */}
                                        {task.tags && task.tags.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {task.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEdit(task)}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
} 