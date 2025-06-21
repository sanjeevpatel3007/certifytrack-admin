'use client';

import { CertificateTemplate, getCertificateTemplates } from '@/action/certificate-template.action';
import { useEffect, useState } from 'react';
import TemplateCard from './TemplateCard';
import toast from 'react-hot-toast';

export default function TemplateList() {
    const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTemplates = async () => {
        try {
            const data = await getCertificateTemplates();
            setTemplates(data);
        } catch (error) {
            toast.error('Failed to load templates');
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No certificate templates found.</p>
                <p className="text-gray-500 text-sm mt-2">Create your first template to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
                <TemplateCard
                    key={template.id}
                    template={template}
                    onDelete={loadTemplates}
                />
            ))}
        </div>
    );
} 