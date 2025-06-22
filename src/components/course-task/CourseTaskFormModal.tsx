'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { CreateCourseTaskInput, CourseTask, TaskDifficultyLevel, createCourseTask, updateCourseTask } from '@/action/course-task.action';
import toast from 'react-hot-toast';

interface CourseTaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseId: string;
    maxDay: number;
    initialData?: CourseTask;
}

const defaultFormData: Omit<CreateCourseTaskInput, 'course_id'> = {
    title: '',
    description: '',
    assigned_day: 1,
    resource_links: [],
    reference_links: [],
    hints: [],
    attachment_urls: [],
    expected_output: '',
    submission_format: '',
    evaluation_criteria: [],
    estimated_time_hrs: 1,
    difficulty_level: 'medium',
    video_tutorial_url: '',
    tags: [],
    is_mandatory: true,
};

export default function CourseTaskFormModal({ isOpen, onClose, onSuccess, courseId, maxDay, initialData }: CourseTaskFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCourseTaskInput>({ ...defaultFormData, course_id: courseId });

    useEffect(() => {
        // Reset form when modal opens/closes
        if (!isOpen) {
            setFormData({ ...defaultFormData, course_id: courseId });
        }

        // Set initial data if editing
        if (isOpen && initialData) {
            const { id, created_at, ...taskData } = initialData;
            // Convert null values to undefined while preserving the type structure
            const formattedData: CreateCourseTaskInput = {
                course_id: taskData.course_id,
                title: taskData.title,
                assigned_day: taskData.assigned_day,
                description: taskData.description ?? undefined,
                order_no: taskData.order_no ?? undefined,
                resource_links: taskData.resource_links ?? undefined,
                reference_links: taskData.reference_links ?? undefined,
                hints: taskData.hints ?? undefined,
                attachment_urls: taskData.attachment_urls ?? undefined,
                expected_output: taskData.expected_output ?? undefined,
                submission_format: taskData.submission_format ?? undefined,
                evaluation_criteria: taskData.evaluation_criteria ?? undefined,
                estimated_time_hrs: taskData.estimated_time_hrs ?? undefined,
                difficulty_level: taskData.difficulty_level,
                video_tutorial_url: taskData.video_tutorial_url ?? undefined,
                tags: taskData.tags ?? undefined,
                is_mandatory: taskData.is_mandatory
            };
            setFormData(formattedData);
        }
    }, [isOpen, initialData, courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (initialData) {
                await updateCourseTask(initialData.id, formData);
                toast.success('Task updated successfully!');
            } else {
                await createCourseTask(formData);
                toast.success('Task created successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(initialData ? 'Failed to update task' : 'Failed to create task');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleArrayInput = (
        field: keyof Pick<CreateCourseTaskInput, 'resource_links' | 'reference_links' | 'hints' | 'attachment_urls' | 'evaluation_criteria' | 'tags'>,
        value: string
    ) => {
        const array = value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [field]: array }));
    };

    const handleInputChange = (field: keyof CreateCourseTaskInput, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    {initialData ? 'Edit Task' : 'Create New Task'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Assigned Day</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={maxDay}
                                                value={formData.assigned_day}
                                                onChange={(e) => handleInputChange('assigned_day', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Task Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Estimated Time (hours)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={formData.estimated_time_hrs}
                                                onChange={(e) => handleInputChange('estimated_time_hrs', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                                            <select
                                                value={formData.difficulty_level}
                                                onChange={(e) => handleInputChange('difficulty_level', e.target.value as TaskDifficultyLevel)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Links */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Resource Links (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.resource_links?.join(', ')}
                                                onChange={(e) => handleArrayInput('resource_links', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="https://example1.com, https://example2.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Reference Links (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.reference_links?.join(', ')}
                                                onChange={(e) => handleArrayInput('reference_links', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="https://ref1.com, https://ref2.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Hints and Tags */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Hints (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.hints?.join(', ')}
                                                onChange={(e) => handleArrayInput('hints', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Hint 1, Hint 2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.tags?.join(', ')}
                                                onChange={(e) => handleArrayInput('tags', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="coding, design"
                                            />
                                        </div>
                                    </div>

                                    {/* Expected Output and Submission Format */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Expected Output</label>
                                        <textarea
                                            value={formData.expected_output}
                                            onChange={(e) => handleInputChange('expected_output', e.target.value)}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Submission Format</label>
                                        <textarea
                                            value={formData.submission_format}
                                            onChange={(e) => handleInputChange('submission_format', e.target.value)}
                                            rows={2}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Evaluation Criteria */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Evaluation Criteria (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={formData.evaluation_criteria?.join(', ')}
                                            onChange={(e) => handleArrayInput('evaluation_criteria', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Code quality, Documentation"
                                        />
                                    </div>

                                    {/* Video Tutorial URL */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Video Tutorial URL</label>
                                        <input
                                            type="url"
                                            value={formData.video_tutorial_url}
                                            onChange={(e) => handleInputChange('video_tutorial_url', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Is Mandatory */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_mandatory}
                                            onChange={(e) => handleInputChange('is_mandatory', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Task is mandatory</label>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Create Task')}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 