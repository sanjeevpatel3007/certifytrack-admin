import { supabase } from "@/lib/supabase";

export interface Course {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    features: string[] | null;
    mentors: string[] | null;
    tags: string[] | null;
    duration_days: number | null;
    difficulty: string | null;
    image_url: string | null;
    video_url: string | null;
    is_published: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    slug: string | null;
    course_certificates?: {
        certificate_id: string;
        certificate_templates?: {
            id: string;
            name: string;
        };
    }[];
}

export interface CreateCourseInput {
    title: string;
    description?: string;
    category?: string;
    features?: string[];
    mentors?: string[];
    tags?: string[];
    duration_days?: number;
    difficulty?: string;
    image_url?: string;
    video_url?: string;
    is_published?: boolean;
    certificate_templates?: string[]; // Array of certificate template IDs
}

export async function createCourse(data: CreateCourseInput) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const { certificate_templates, ...courseData } = data;
        
        // Generate slug from title
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Create course
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert([{
                ...courseData,
                created_by: userData.user.id,
                slug,
                // Ensure all array fields are properly handled
                tags: courseData.tags || [],
                mentors: courseData.mentors || [],
                features: courseData.features || [],
                // Set default values
                is_published: courseData.is_published || false
            }])
            .select()
            .single();

        if (courseError) throw courseError;

        // If certificate templates are provided, create the connections
        if (certificate_templates?.length) {
            const { error: certError } = await supabase
                .from('course_certificates')
                .insert(
                    certificate_templates.map(cert_id => ({
                        course_id: course.id,
                        certificate_id: cert_id
                    }))
                );

            if (certError) throw certError;
        }

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
            .select(`
                *,
                course_certificates (
                    certificate_id,
                    certificate_templates (
                        id,
                        name
                    )
                )
            `)
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
        const { certificate_templates, ...updateData } = data;

        // Update course data
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .update({
                ...updateData,
                // Ensure all array fields are properly handled
                tags: updateData.tags || [],
                mentors: updateData.mentors || [],
                features: updateData.features || [],
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (courseError) throw courseError;

        // If certificate templates are provided, update the connections
        if (certificate_templates !== undefined) {
            // Delete existing connections
            const { error: deleteError } = await supabase
                .from('course_certificates')
                .delete()
                .eq('course_id', id);

            if (deleteError) throw deleteError;

            // Create new connections if there are templates
            if (certificate_templates.length > 0) {
                const { error: certError } = await supabase
                    .from('course_certificates')
                    .insert(
                        certificate_templates.map(cert_id => ({
                            course_id: id,
                            certificate_id: cert_id
                        }))
                    );

                if (certError) throw certError;
            }
        }

        return course;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
} 