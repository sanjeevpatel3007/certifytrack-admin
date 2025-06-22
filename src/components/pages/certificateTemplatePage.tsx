'use client';

import { useState } from 'react';
import TemplateFormModal from '../certificate-template/TemplateFormModal';
import TemplateList from '../certificate-template/TemplateList';

export default function CertificateTemplatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState(0); // Used to force re-render of template list

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
          <p className="mt-1 text-sm text-gray-500">Manage available certificate templates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Template
        </button>
      </div>

      <div className="shadow rounded-xl">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Available Templates</h2>
          </div>
          <TemplateList key={key} />
        </div>
      </div>

      <TemplateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setKey(prev => prev + 1); // Force template list to refresh
        }}
      />
    </div>
  );
}