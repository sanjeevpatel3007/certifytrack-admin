'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { CreateCourseInput, Course, createCourse, updateCourse } from '@/action/course.action';
import { CertificateTemplate, getCertificateTemplates } from '@/action/certificate-template.action';
import { uploadImage } from '@/lib/utils/upload';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CourseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Course;
}

const defaultFormData: CreateCourseInput = {
    title: '',
    description: '',
    category: '',
    features: [],
    mentors: [],
    tags: [],
    duration_days: 30,
    difficulty: 'beginner',
    image_url: '',
    video_url: '',
    is_published: false,
    certificate_templates: []
};

export default function CourseFormModal({ isOpen, onClose, onSuccess, initialData }: CourseFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [certificates, setCertificates] = useState<CertificateTemplate[]>([]);
    const [formData, setFormData] = useState<CreateCourseInput>(defaultFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        // Load certificate templates
        const loadCertificates = async () => {
            try {
                const data = await getCertificateTemplates();
                setCertificates(data);
            } catch (error) {
                toast.error('Failed to load certificate templates');
            }
        };

        loadCertificates();

        // Reset form when modal opens/closes
        if (!isOpen) {
            setFormData(defaultFormData);
            setImageFile(null);
            setImagePreview('');
        }

        // Set initial data if editing
        if (isOpen && initialData) {
            const certificateIds = initialData.course_certificates?.map(
                (cc) => cc.certificate_id
            ) || [];

            // Convert null values to undefined to match CreateCourseInput type
            const formattedData: CreateCourseInput = {
                title: initialData.title,
                description: initialData.description ?? undefined,
                category: initialData.category ?? undefined,
                features: initialData.features ?? undefined,
                mentors: initialData.mentors ?? undefined,
                tags: initialData.tags ?? undefined,
                duration_days: initialData.duration_days ?? undefined,
                difficulty: initialData.difficulty ?? undefined,
                image_url: initialData.image_url ?? undefined,
                video_url: initialData.video_url ?? undefined,
                is_published: initialData.is_published,
                certificate_templates: certificateIds
            };

            setFormData(formattedData);

            if (initialData.image_url) {
                setImagePreview(initialData.image_url);
            }
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image_url;

            // Upload image if a new file is selected
            if (imageFile) {
                imageUrl = await uploadImage(imageFile, 'course-banner');
            }

            const dataToSubmit = {
                ...formData,
                image_url: imageUrl
            };

            if (initialData) {
                await updateCourse(initialData.id, dataToSubmit);
                toast.success('Course updated successfully!');
            } else {
                await createCourse(dataToSubmit);
                toast.success('Course created successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(initialData ? 'Failed to update course' : 'Failed to create course');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleArrayInput = (field: keyof CreateCourseInput, value: string) => {
        const array = value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [field]: array }));
    };

    const handleInputChange = (field: keyof CreateCourseInput, value: any) => {
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
                                    {initialData ? 'Edit Course' : 'Create New Course'}
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
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => handleInputChange('category', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

                                    {/* Course Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                                            <input
                                                type="number"
                                                value={formData.duration_days}
                                                onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                                            <select
                                                value={formData.difficulty}
                                                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Arrays */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.tags?.join(', ')}
                                                onChange={(e) => handleArrayInput('tags', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="web, programming, javascript"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mentors (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.mentors?.join(', ')}
                                                onChange={(e) => handleArrayInput('mentors', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="John Doe, Jane Smith"
                                            />
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={formData.features?.join(', ')}
                                            onChange={(e) => handleArrayInput('features', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Live sessions, Projects, Assignments"
                                        />
                                    </div>

                                    {/* Media URLs */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Video URL</label>
                                            <input
                                                type="url"
                                                value={formData.video_url}
                                                onChange={(e) => handleInputChange('video_url', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Course Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="mt-1 block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Certificate Templates */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Templates</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {certificates.map((cert) => (
                                                <label key={cert.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.certificate_templates?.includes(cert.id)}
                                                        onChange={(e) => {
                                                            const templates = formData.certificate_templates || [];
                                                            if (e.target.checked) {
                                                                handleInputChange('certificate_templates', [...templates, cert.id]);
                                                            } else {
                                                                handleInputChange(
                                                                    'certificate_templates',
                                                                    templates.filter(id => id !== cert.id)
                                                                );
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{cert.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Publishing Status */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_published}
                                            onChange={(e) => handleInputChange('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Publish course</label>
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
                                            {loading ? 'Saving...' : (initialData ? 'Update Course' : 'Create Course')}
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