'use client';

import React from 'react';

const CertificateTemplatePage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certificate Templates</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Add New Template
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Available Templates</h2>
        </div>
        
        <div className="p-4">
          <div className="text-gray-500 text-center py-8">
            No certificate templates found. Create your first template to get started.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplatePage;