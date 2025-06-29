'use client';

import { useEffect, useState } from 'react';
import { Mentor, getMentorByEmail, updateMentor } from '@/action/mentors.action';
import { uploadImage } from '@/lib/utils/upload';

type Props = {
    email: string;
};

export default function MentorFormPage({ email }: Props) {
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        domain: '',
        specialization: '',
        experience_years: '',
        linkedin_url: '',
        bio: '',
        availability_status: 'available',
        profile_photo_url: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const loadMentor = async (email: string) => {
        try {
            const mentorData = await getMentorByEmail(email);
            if (mentorData) {
                setMentor(mentorData);
                setFormData({
                    full_name: mentorData.full_name || '',
                    domain: mentorData.domain || '',
                    specialization: mentorData.specialization || '',
                    experience_years: mentorData.experience_years?.toString() || '',
                    linkedin_url: mentorData.linkedin_url || '',
                    bio: mentorData.bio || '',
                    availability_status: mentorData.availability_status || 'available',
                    profile_photo_url: mentorData.profile_photo_url || '',
                });
                if (mentorData.profile_photo_url) {
                    setImagePreview(mentorData.profile_photo_url);
                }
            } else {
                setError('Mentor not found');
            }
        } catch (err) {
            console.error('Error loading mentor:', err);
            setError('Error loading mentor data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        try {
            if (!email) {
                setError('Invalid form link');
                setLoading(false);
                return;
            }

            const decodedEmail = atob(decodeURIComponent(email));
            if (!decodedEmail) {
                setError('Invalid form link');
                setLoading(false);
                return;
            }

            loadMentor(decodedEmail);
        } catch (err) {
            console.error('Error initializing page:', err);
            setError('Error loading mentor data');
            setLoading(false);
        }
    }, [email]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (limit to 1MB)
            if (file.size > 1024 * 1024) {
                alert('File size must be less than 1MB');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentor) return;

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            let profile_photo_url = formData.profile_photo_url;
            if (imageFile) {
                try {
                    profile_photo_url = await uploadImage(imageFile, 'mentors');
                } catch (err) {
                    console.error('Error uploading image:', err);
                    setError('Failed to upload image. Please try again with a smaller image.');
                    setLoading(false);
                    return;
                }
            }

            await updateMentor(mentor.id, {
                ...formData,
                profile_photo_url,
                experience_years: parseInt(formData.experience_years) || 0,
            });
            setSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error('Error updating mentor:', err);
            setError('Error updating mentor information');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Mentor Profile</h2>

                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        Profile updated successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Max file size: 1MB. Supported formats: JPG, PNG, GIF</p>
                    </div>

                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domain</label>
                        <input
                            type="text"
                            id="domain"
                            name="domain"
                            value={formData.domain}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                        <input
                            type="text"
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                        <input
                            type="number"
                            id="experience_years"
                            name="experience_years"
                            value={formData.experience_years}
                            onChange={handleChange}
                            required
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                        <input
                            type="url"
                            id="linkedin_url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="availability_status" className="block text-sm font-medium text-gray-700">Availability Status</label>
                        <select
                            id="availability_status"
                            name="availability_status"
                            value={formData.availability_status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                            <option value="busy">Busy</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 