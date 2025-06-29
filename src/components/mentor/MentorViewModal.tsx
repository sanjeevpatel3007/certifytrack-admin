import { Mentor, updateMentor } from '@/action/mentors.action';

interface MentorViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: Mentor | null;
    onUpdate: () => void;
}

export default function MentorViewModal({ isOpen, onClose, mentor, onUpdate }: MentorViewModalProps) {
    if (!isOpen || !mentor) return null;

    const handleVerificationToggle = async () => {
        try {
            await updateMentor(mentor.id, {
                verified: !mentor.verified
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating mentor verification:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mentor Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                            {mentor.profile_photo_url ? (
                                <img
                                    src={mentor.profile_photo_url}
                                    alt={mentor.full_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{mentor.full_name}</h3>
                            <p className="text-gray-500">{mentor.email}</p>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mentor.availability_status === 'available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {mentor.availability_status}
                                </span>
                                <button
                                    onClick={handleVerificationToggle}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${mentor.verified ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${mentor.verified ? 'translate-x-5' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                                <span className="ml-2 text-sm font-medium">
                                    {mentor.verified ? 'Verified ✓' : 'Not Verified'}
                                </span>

                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Domain</h4>
                            <p className="mt-1 text-sm text-gray-900">{mentor.domain || 'Not specified'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Specialization</h4>
                            <p className="mt-1 text-sm text-gray-900">{mentor.specialization || 'Not specified'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                            <p className="mt-1 text-sm text-gray-900">
                                {mentor.experience_years ? `${mentor.experience_years} years` : 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                            <p className="mt-1 text-sm text-gray-900">
                                {mentor.rating ? `${mentor.rating}/5 (${mentor.review_count} reviews)` : 'No ratings yet'}
                            </p>
                        </div>
                    </div>

                    {mentor.linkedin_url && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">LinkedIn</h4>
                            <a
                                href={mentor.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                                {mentor.linkedin_url}
                            </a>
                        </div>
                    )}

                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                        <p className="mt-1 text-sm text-gray-900">{mentor.bio || 'No bio provided'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm text-gray-500">
                        <div>
                            <span>Joined: {new Date(mentor.joined_on || '').toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span>Last Active: {new Date(mentor.last_active || '').toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 