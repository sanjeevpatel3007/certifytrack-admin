import { supabase } from "@/lib/supabase";

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CertificateTemplate {
    completion?: {
        title: string;
        template: string;
    };
    course?: {
        title: string;
        template: string;
    };
}

export interface Course {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    features: string[] | null;
    mentors: string[] | null;
    tags: string[] | null;
    duration_days: number | null;
    difficulty: CourseDifficulty | null;
    image_url: string | null;
    video_url: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    certificate_template: CertificateTemplate | null;
}

export interface CreateCourseInput {
    title: string;
    description?: string;
    category?: string;
    features?: string[];
    mentors?: string[];
    tags?: string[];
    duration_days?: number;
    difficulty?: CourseDifficulty;
    image_url?: string;
    video_url?: string;
    is_published?: boolean;
    certificate_template?: CertificateTemplate;
}

export async function createCourse(data: CreateCourseInput) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert([{
                ...data,
                created_by: userData.user.id,
                // Ensure all array fields are properly handled
                features: data.features || [],
                mentors: data.mentors || [],
                tags: data.tags || [],
                // Set default values
                difficulty: data.difficulty || 'beginner',
                is_published: data.is_published || false
            }])
            .select()
            .single();

        if (courseError) throw courseError;
        return course;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

export async function getCourses() {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

export async function deleteCourse(id: string) {
    try {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}

export async function updateCourse(id: string, data: Partial<CreateCourseInput>) {
    try {
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .update({
                ...data,
                // Ensure all array fields are properly handled
                features: data.features || [],
                mentors: data.mentors || [],
                tags: data.tags || [],
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (courseError) throw courseError;
        return course;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

export async function getCourseById(id: string) {
    try {
        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return course;
    } catch (error) {
        console.error('Error fetching course:', error);
        throw error;
    }
} 