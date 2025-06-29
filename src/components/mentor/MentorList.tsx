import { useState, useEffect } from 'react';
import { Mentor, getMentors, deleteMentor } from '@/action/mentors.action';
import MentorFormModal from './MentorFormModal';
import MentorViewModal from './MentorViewModal';

export default function MentorList() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMentors();
    }, []);

    const loadMentors = async () => {
        try {
            const data = await getMentors();
            setMentors(data || []);
        } catch (error) {
            console.error('Error loading mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsFormModalOpen(true);
    };

    const handleView = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsViewModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this mentor?')) {
            try {
                await deleteMentor(id);
                await loadMentors();
            } catch (error) {
                console.error('Error deleting mentor:', error);
            }
        }
    };

    const handleAddNew = () => {
        setSelectedMentor(null);
        setIsFormModalOpen(true);
    };

    const handleFormModalClose = () => {
        setIsFormModalOpen(false);
        setSelectedMentor(null);
        loadMentors();
    };

    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
        setSelectedMentor(null);
        loadMentors();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mentors</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Mentor
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mentors.map((mentor) => (
                            <tr key={mentor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {mentor.profile_photo_url ? (
                                            <img
                                                className="h-10 w-10 rounded-full mr-3 object-cover"
                                                src={mentor.profile_photo_url}
                                                alt={mentor.full_name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">
                                                    {mentor.full_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{mentor.full_name}</div>
                                            {mentor.verified && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {mentor.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {mentor.domain}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        mentor.availability_status === 'available'
                                            ? 'bg-green-100 text-green-800'
                                            : mentor.availability_status === 'busy'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {mentor.availability_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleView(mentor)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleEdit(mentor)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(mentor.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <MentorFormModal
                isOpen={isFormModalOpen}
                onClose={handleFormModalClose}
                mentor={selectedMentor}
            />

            <MentorViewModal
                isOpen={isViewModalOpen}
                onClose={handleViewModalClose}
                mentor={selectedMentor}
                onUpdate={loadMentors}
            />
        </div>
    );
} 