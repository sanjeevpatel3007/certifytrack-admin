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
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Internships</h1>
                    <p className="text-gray-500 mt-1">Manage your internship programs</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedInternship(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create Internship
                </button>
            </div>

            <InternshipList onEdit={handleEdit} />

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