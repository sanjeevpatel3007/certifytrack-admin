'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { CreateInternshipInput, InternshipMode, InternshipStatus, PriceType, createInternship, updateInternship } from '@/action/internship.action';
import { uploadImage } from '@/lib/utils/upload';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface InternshipFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // For editing
}

const defaultFormData: CreateInternshipInput = {
    title: '',
    description: '',
    long_description: '',
    duration_days: 30,
    start_date: '',
    end_date: '',
    price_type: 'free',
    price_value: 0,
    tags: [],
    mentors: [],
    features: [],
    requirements: [],
    benefits: [],
    location: '',
    mode: 'online',
    application_link: '',
    max_applicants: 100,
    status: 'upcoming',
    organization_name: '',
    image_url: '',
    is_published: false,
    certificate_template: {
        completion: {
            title: '',
            template: ''
        },
        internship: {
            title: '',
            template: ''
        }
    }
};

export default function InternshipFormModal({ isOpen, onClose, onSuccess, initialData }: InternshipFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateInternshipInput>(defaultFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        // Reset form when modal opens/closes
        if (!isOpen) {
            setFormData(defaultFormData);
            setImageFile(null);
            setImagePreview('');
        }

        // Set initial data if editing
        if (isOpen && initialData) {
            // Ensure certificate template data is properly structured
            const certificateTemplate = initialData.certificate_template || {
                completion: { title: '', template: '' },
                internship: { title: '', template: '' }
            };

            setFormData({
                ...initialData,
                certificate_template: {
                    completion: {
                        title: certificateTemplate.completion?.title || '',
                        template: certificateTemplate.completion?.template || ''
                    },
                    internship: {
                        title: certificateTemplate.internship?.title || '',
                        template: certificateTemplate.internship?.template || ''
                    }
                }
            });

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
                imageUrl = await uploadImage(imageFile, 'internship-banner');
            }

            // Remove computed fields that shouldn't be sent to the database
            const { stats, tasks, ...dataWithoutComputed } = formData;

            const dataToSubmit = {
                ...dataWithoutComputed,
                image_url: imageUrl,
                certificate_template: {
                    completion: {
                        title: formData.certificate_template?.completion?.title || '',
                        template: formData.certificate_template?.completion?.template || ''
                    },
                    internship: {
                        title: formData.certificate_template?.internship?.title || '',
                        template: formData.certificate_template?.internship?.template || ''
                    }
                }
            };

            if (initialData) {
                await updateInternship(initialData.id, dataToSubmit);
                toast.success('Internship updated successfully!');
            } else {
                await createInternship(dataToSubmit);
                toast.success('Internship created successfully!');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(initialData ? 'Failed to update internship' : 'Failed to create internship');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleArrayInput = (field: keyof CreateInternshipInput, value: string) => {
        const array = value.split(',').map(item => item.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, [field]: array }));
    };

    const handleInputChange = (field: keyof CreateInternshipInput, value: any) => {
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
                                    {initialData ? 'Edit Internship' : 'Create New Internship'}
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
                                            <label className="block text-sm font-medium text-gray-700">Organization</label>
                                            <input
                                                type="text"
                                                value={formData.organization_name}
                                                onChange={(e) => handleInputChange('organization_name', e.target.value)}
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

                                    {/* Long Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Long Description</label>
                                        <textarea
                                            value={formData.long_description}
                                            onChange={(e) => handleInputChange('long_description', e.target.value)}
                                            rows={5}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Duration and Dates */}
                                    <div className="grid grid-cols-3 gap-4">
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
                                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.start_date}
                                                onChange={(e) => handleInputChange('start_date', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.end_date}
                                                onChange={(e) => handleInputChange('end_date', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Price Type</label>
                                            <select
                                                value={formData.price_type}
                                                onChange={(e) => handleInputChange('price_type', e.target.value as PriceType)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="free">Free</option>
                                                <option value="paid">Paid</option>
                                            </select>
                                        </div>
                                        {formData.price_type === 'paid' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Price Value</label>
                                                <input
                                                    type="number"
                                                    value={formData.price_value}
                                                    onChange={(e) => handleInputChange('price_value', parseFloat(e.target.value))}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    step="0.01"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mode and Location */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mode</label>
                                            <select
                                                value={formData.mode}
                                                onChange={(e) => handleInputChange('mode', e.target.value as InternshipMode)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="online">Online</option>
                                                <option value="offline">Offline</option>
                                                <option value="hybrid">Hybrid</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Application Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Application Link</label>
                                            <input
                                                type="url"
                                                value={formData.application_link}
                                                onChange={(e) => handleInputChange('application_link', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Max Applicants</label>
                                            <input
                                                type="number"
                                                value={formData.max_applicants}
                                                onChange={(e) => handleInputChange('max_applicants', parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Arrays */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.tags?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput('tags', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Mentors (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.mentors?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput('mentors', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Features, Requirements, Benefits */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.features?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput('features', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Requirements (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.requirements?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput('requirements', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Benefits (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={formData.benefits?.join(', ') || ''}
                                                onChange={(e) => handleArrayInput('benefits', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Certificate Template */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Templates</label>
                                        <div className="space-y-4">
                                            {/* Completion Certificate */}
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Completion Certificate</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-500">Title</label>
                                                        <input
                                                            type="text"
                                                            value={formData.certificate_template?.completion?.title || ''}
                                                            onChange={(e) => handleInputChange('certificate_template', {
                                                                ...formData.certificate_template,
                                                                completion: {
                                                                    ...formData.certificate_template?.completion,
                                                                    title: e.target.value
                                                                }
                                                            })}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500">Template HTML</label>
                                                        <textarea
                                                            value={formData.certificate_template?.completion?.template || ''}
                                                            onChange={(e) => handleInputChange('certificate_template', {
                                                                ...formData.certificate_template,
                                                                completion: {
                                                                    ...formData.certificate_template?.completion,
                                                                    template: e.target.value
                                                                }
                                                            })}
                                                            rows={8}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Internship Certificate */}
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 mb-2">Internship Certificate</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs text-gray-500">Title</label>
                                                    <input
                                                            type="text"
                                                            value={formData.certificate_template?.internship?.title || ''}
                                                            onChange={(e) => handleInputChange('certificate_template', {
                                                                ...formData.certificate_template,
                                                                internship: {
                                                                    ...formData.certificate_template?.internship,
                                                                    title: e.target.value
                                                                }
                                                            })}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500">Template HTML</label>
                                                        <textarea
                                                            value={formData.certificate_template?.internship?.template || ''}
                                                            onChange={(e) => handleInputChange('certificate_template', {
                                                                ...formData.certificate_template,
                                                                internship: {
                                                                    ...formData.certificate_template?.internship,
                                                                    template: e.target.value
                                                                }
                                                            })}
                                                            rows={8}
                                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status and Publishing */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => handleInputChange('status', e.target.value as InternshipStatus)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="upcoming">Upcoming</option>
                                                <option value="ongoing">Ongoing</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_published}
                                                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label className="ml-2 block text-sm text-gray-700">
                                                Publish Internship
                                            </label>
                                        </div>
                                    </div>

                                    {/* Add Image Upload Section right after Basic Information */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                                            <div className="mt-1 flex items-center space-x-4">
                                                <div className="relative w-40 h-24 border rounded-lg overflow-hidden bg-gray-50">
                                                    {imagePreview ? (
                                                        <Image
                                                            src={imagePreview}
                                                            alt="Banner preview"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="block w-full text-sm text-gray-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded-md file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-indigo-50 file:text-indigo-700
                                                            hover:file:bg-indigo-100"
                                                    />
                                                    <p className="text-xs text-gray-500">
                                                        Recommended size: 1200x600px. Max size: 5MB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        >
                                            {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
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