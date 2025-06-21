'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CreateTemplateInput, createCertificateTemplate } from '@/action/certificate-template.action';
import toast from 'react-hot-toast';

interface TemplateFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TemplateFormModal({ isOpen, onClose, onSuccess }: TemplateFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateTemplateInput>({
        name: '',
        template_json: {
            width: 800,
            height: 600,
            background: '#ffffff',
            elements: []
        },
        template_html: '<div class="certificate"></div>'
    });
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createCertificateTemplate(formData);
            toast.success('Certificate template created successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to create template');
            console.error('Error creating template:', error);
        } finally {
            setLoading(false);
        }
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Create Certificate Template
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Template Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Template HTML
                                        </label>
                                        <textarea
                                            value={formData.template_html}
                                            onChange={(e) => setFormData({ ...formData, template_html: e.target.value })}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Preview URL (optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.preview_url || ''}
                                            onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                        >
                                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                                        </button>

                                        <div className="flex space-x-2">
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
                                                {loading ? 'Creating...' : 'Create Template'}
                                            </button>
                                        </div>
                                    </div>

                                    {showPreview && (
                                        <div className="mt-4 border rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                                            <div
                                                className="w-full bg-white shadow rounded"
                                                style={{
                                                    width: formData.template_json.width,
                                                    height: formData.template_json.height,
                                                    maxWidth: '100%',
                                                    overflow: 'auto'
                                                }}
                                                dangerouslySetInnerHTML={{ __html: formData.template_html }}
                                            />
                                        </div>
                                    )}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 