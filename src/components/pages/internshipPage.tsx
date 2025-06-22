'use client';

import { useState } from 'react';
import InternshipFormModal from '../internship/InternshipFormModal';
import InternshipList from '../internship/InternshipList';

export default function InternshipPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState<any>(null);

    const handleEdit = (internship: any) => {
        setSelectedInternship(internship);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setSelectedInternship(null);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Internship Programs
                                </h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Create and manage your organization's internship opportunities
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                onClick={() => {
                                    setSelectedInternship(null);
                                    setIsModalOpen(true);
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg 
                                    className="-ml-1 mr-2 h-5 w-5" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 4v16m8-8H4" 
                                    />
                                </svg>
                                Create New Internship
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <InternshipList onEdit={handleEdit} />
                </div>
            </div>

            <InternshipFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedInternship(null);
                }}
                onSuccess={handleSuccess}
                initialData={selectedInternship}
            />
        </div>
    );
}