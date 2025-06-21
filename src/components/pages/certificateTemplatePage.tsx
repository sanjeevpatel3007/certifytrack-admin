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
        <h1 className="text-2xl font-bold">Certificate Templates</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Available Templates</h2>
        </div>
        
        <div className="p-4">
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