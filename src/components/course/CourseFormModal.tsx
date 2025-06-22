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
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title as="h3" className="text-lg font-semibold text-white">
                                            {initialData ? 'Edit Course' : 'Create New Course'}
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="text-white/80 hover:text-white transition-colors duration-200"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-indigo-100 text-sm mt-1">
                                        {initialData ? 'Update your course details and settings' : 'Set up a new course with all the details'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                    {/* Basic Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Basic Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="Enter course title"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    value={formData.category}
                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="e.g., Programming, Design, Business"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                placeholder="Describe your course content and objectives"
                                            />
                                        </div>
                                    </div>

                                    {/* Course Details */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Course Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                                                <input
                                                    type="number"
                                                    value={formData.duration_days}
                                                    onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                                                <select
                                                    value={formData.difficulty}
                                                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                >
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrays */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            Tags & People
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={formData.tags?.join(', ')}
                                                    onChange={(e) => handleArrayInput('tags', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="web, programming, javascript"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mentors (comma-separated)</label>
                                                <input
                                                    type="text"
                                                    value={formData.mentors?.join(', ')}
                                                    onChange={(e) => handleArrayInput('mentors', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="John Doe, Jane Smith"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.features?.join(', ')}
                                                onChange={(e) => handleArrayInput('features', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                placeholder="Live sessions, Projects, Assignments"
                                            />
                                        </div>
                                    </div>

                                    {/* Media */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Media & Resources
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.video_url}
                                                    onChange={(e) => handleInputChange('video_url', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                />
                                            </div>
                                        </div>
                                        {imagePreview && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                                                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-300">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Certificate Templates */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Certificate Templates
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {certificates.map((cert) => (
                                                <label key={cert.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200">
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
                                                    <span className="ml-3 text-sm text-gray-700">{cert.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Publishing Status */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_published}
                                                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Publish course</label>
                                                <p className="text-xs text-gray-500">Make this course available to students</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {initialData ? 'Updating...' : 'Creating...'}
                                                </div>
                                            ) : (
                                                initialData ? 'Update Course' : 'Create Course'
                                            )}
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