import { supabase } from "@/lib/supabase";

export interface Mentor {
    id: string;
    full_name: string;
    email: string;
    domain: string;
    specialization?: string;
    experience_years?: number;
    linkedin_url?: string;
    profile_photo_url?: string;
    bio?: string;
    availability_status?: string;
    joined_on?: string;
    last_active?: string;
    verified?: boolean;
    rating?: number;
    review_count?: number;
}

export interface CreateMentorInput {
    email: string;
}

export interface UpdateMentorInput {
    full_name?: string;
    domain?: string;
    specialization?: string;
    experience_years?: number;
    linkedin_url?: string;
    profile_photo_url?: string;
    bio?: string;
    availability_status?: string;
    verified?: boolean;
}

export async function createMentor(data: CreateMentorInput) {
    try {
        const { data: mentor, error } = await supabase
            .from('mentors')
            .insert([{
                email: data.email,
                full_name: data.email.split('@')[0], // Temporary name from email
                domain: 'Not Specified', // Default value
            }])
            .select()
            .single();

        if (error) throw error;
        return mentor;
    } catch (error) {
        console.error('Error creating mentor:', error);
        throw error;
    }
}

export async function getMentors() {
    try {
        const { data, error } = await supabase
            .from('mentors')
            .select('*')
            .order('joined_on', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching mentors:', error);
        throw error;
    }
}

export async function getMentorByEmail(email: string) {
    try {
        const { data, error } = await supabase
            .from('mentors')
            .select('*')
            .eq('email', email)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching mentor:', error);
        throw error;
    }
}

export async function updateMentor(id: string, data: UpdateMentorInput) {
    try {
        const { data: mentor, error } = await supabase
            .from('mentors')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return mentor;
    } catch (error) {
        console.error('Error updating mentor:', error);
        throw error;
    }
}

export async function deleteMentor(id: string) {
    try {
        const { error } = await supabase
            .from('mentors')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting mentor:', error);
        throw error;
    }
}

export function generateMentorFormLink(email: string) {
    // Base64 encode the email to make it URL-safe
    const encodedEmail = btoa(email);
    // Return the public form URL
    return `/mentor/form/${encodedEmail}`;
}
