'use client';

import { CertificateTemplate, deleteCertificateTemplate } from '@/action/certificate-template.action';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface TemplateCardProps {
  template: CertificateTemplate;
  onDelete: () => void;
}

export default function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    setLoading(true);
    try {
      await deleteCertificateTemplate(template.id);
      toast.success('Template deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete template');
      console.error('Error deleting template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Certificate Preview</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                background: #f4f4f4;
              }
            </style>
          </head>
          <body>
            ${template.template_html || ''}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between  items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500">
            Created on {new Date(template.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {/* Small preview */}
      <div className="overflow-hidden border rounded-md shadow-sm mb-4">
        <div
          className="origin-top-left h-auto scale-[0.3] transform"
          style={{ width: '1000px', height: '200px' }}
          dangerouslySetInnerHTML={{ __html: template.template_html || '' }}
        />
      </div>

      {/* Preview button */}
      <button
        onClick={handlePreview}
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
      >
        Preview Template
      </button>
    </div>
  );
}
