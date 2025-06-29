import { useState, useEffect } from 'react';
import { Mentor, createMentor, updateMentor, generateMentorFormLink } from '@/action/mentors.action';

interface MentorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: Mentor | null;
}

export default function MentorFormModal({ isOpen, onClose, mentor }: MentorFormModalProps) {
    const [email, setEmail] = useState('');
    const [formLink, setFormLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mentor) {
            setEmail(mentor.email);
            setFormLink(generateMentorFormLink(mentor.email));
        } else {
            setEmail('');
            setFormLink('');
        }
    }, [mentor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mentor) {
                await updateMentor(mentor.id, {
                    // Only admin editable fields
                    verified: mentor.verified,
                });
            } else {
                const newMentor = await createMentor({ email });
                if (newMentor) {
                    setFormLink(generateMentorFormLink(email));
                }
            }
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">
                    {mentor ? 'Edit Mentor' : 'Add New Mentor'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            disabled={!!mentor}
                        />
                    </div>

                    {formLink && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Public Form Link
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={`${window.location.origin}${formLink}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    readOnly
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}${formLink}`);
                                    }}
                                    className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : mentor ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 