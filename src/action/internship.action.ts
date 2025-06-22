import { supabase } from "@/lib/supabase";

export type InternshipMode = 'online' | 'offline' | 'hybrid';
export type InternshipStatus = 'upcoming' | 'ongoing' | 'completed';
export type PriceType = 'free' | 'paid';

export interface InternshipStats {
    total_students: number;
    active_students: number;
    completed_students: number;
    total_tasks: number;
    total_submissions: number;
    pending_submissions: number;
    approved_submissions: number;
    rejected_submissions: number;
    mandatory_tasks: number;
    tasks_by_difficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
}

export interface Internship {
    id: string;
    title: string;
    description: string | null;
    long_description: string | null;
    duration_days: number | null;
    start_date: string | null;
    end_date: string | null;
    price_type: PriceType;
    price_value: number;
    tags: string[] | null;
    mentors: string[] | null;
    features: string[] | null;
    requirements: string[] | null;
    benefits: string[] | null;
    certificate_count: number;
    location: string | null;
    mode: InternshipMode;
    application_link: string | null;
    max_applicants: number | null;
    status: InternshipStatus;
    organization_name: string | null;
    rating: number;
    review_count: number;
    image_url: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    slug: string | null;
    stats?: InternshipStats;
    tasks?: {
        id: string;
        title: string;
        assigned_day: number;
        difficulty_level: 'easy' | 'medium' | 'hard';
        is_mandatory: boolean;
        submissions?: {
            id: string;
            status: 'pending' | 'approved' | 'rejected';
            submitted_at: string;
        }[];
    }[];
    internship_certificates?: {
        certificate_templates: {
            id: string;
            name: string;
        };
    }[];
}

export interface CreateInternshipInput {
    title: string;
    description?: string;
    long_description?: string;
    duration_days?: number;
    start_date?: string;
    end_date?: string;
    price_type?: PriceType;
    price_value?: number;
    tags?: string[];
    mentors?: string[];
    features?: string[];
    requirements?: string[];
    benefits?: string[];
    location?: string;
    mode?: InternshipMode;
    application_link?: string;
    max_applicants?: number;
    status?: InternshipStatus;
    organization_name?: string;
    image_url?: string;
    is_published?: boolean;
    certificate_templates?: string[]; // Array of certificate template IDs
}

export async function createInternship(data: CreateInternshipInput) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const { certificate_templates, ...internshipData } = data;
        
        // Generate slug from title
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Start a transaction
        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .insert([{
                ...internshipData,
                created_by: userData.user.id,
                slug,
                // Ensure all array fields are properly handled
                tags: internshipData.tags || [],
                mentors: internshipData.mentors || [],
                features: internshipData.features || [],
                requirements: internshipData.requirements || [],
                benefits: internshipData.benefits || [],
                // Set default values for required fields
                price_type: internshipData.price_type || 'free',
                price_value: internshipData.price_value || 0,
                mode: internshipData.mode || 'online',
                status: internshipData.status || 'upcoming',
                is_published: internshipData.is_published || false,
                certificate_count: certificate_templates?.length || 1
            }])
            .select()
            .single();

        if (internshipError) throw internshipError;

        // If certificate templates are provided, create the connections
        if (certificate_templates?.length) {
            const { error: certError } = await supabase
                .from('internship_certificates')
                .insert(
                    certificate_templates.map(cert_id => ({
                        internship_id: internship.id,
                        certificate_id: cert_id
                    }))
                );

            if (certError) throw certError;
        }

        return internship;
    } catch (error) {
        console.error('Error creating internship:', error);
        throw error;
    }
}

export async function getInternships() {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select(`
                *,
                internship_certificates (
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
        console.error('Error fetching internships:', error);
        throw error;
    }
}

export async function deleteInternship(id: string) {
    try {
        const { error } = await supabase
            .from('internships')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting internship:', error);
        throw error;
    }
}

export async function updateInternship(id: string, data: Partial<CreateInternshipInput>) {
    try {
        const { certificate_templates, ...updateData } = data;

        // Update internship data
        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .update({
                ...updateData,
                // Ensure all array fields are properly handled
                tags: updateData.tags || [],
                mentors: updateData.mentors || [],
                features: updateData.features || [],
                requirements: updateData.requirements || [],
                benefits: updateData.benefits || [],
                // Update certificate count if templates are provided
                certificate_count: certificate_templates?.length || 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (internshipError) throw internshipError;

        // If certificate templates are provided, update the connections
        if (certificate_templates !== undefined) {
            // Delete existing connections
            const { error: deleteError } = await supabase
                .from('internship_certificates')
                .delete()
                .eq('internship_id', id);

            if (deleteError) throw deleteError;

            // Create new connections if there are templates
            if (certificate_templates.length > 0) {
                const { error: certError } = await supabase
                    .from('internship_certificates')
                    .insert(
                        certificate_templates.map(cert_id => ({
                            internship_id: id,
                            certificate_id: cert_id
                        }))
                    );

                if (certError) throw certError;
            }
        }

        return internship;
    } catch (error) {
        console.error('Error updating internship:', error);
        throw error;
    }
}

interface Task {
    id: string;
    title: string;
    assigned_day: number;
    difficulty_level: 'easy' | 'medium' | 'hard';
    is_mandatory: boolean;
    submissions?: {
        id: string;
        status: 'pending' | 'approved' | 'rejected';
        submitted_at: string;
    }[];
}

interface InternshipSubscription {
    status: 'active' | 'cancelled' | 'completed';
}

export async function getInternshipById(id: string) {
    try {
        // Fetch internship with all related data
        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .select(`
                *,
                internship_certificates (
                    certificate_id,
                    certificate_templates (
                        id,
                        name
                    )
                ),
                tasks (
                    id,
                    title,
                    assigned_day,
                    difficulty_level,
                    is_mandatory,
                    submissions (
                        id,
                        status,
                        submitted_at
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (internshipError) throw internshipError;

        // Fetch subscription stats
        const { data: subscriptions, error: subscriptionError } = await supabase
            .from('internship_subscriptions')
            .select('status')
            .eq('internship_id', id);

        if (subscriptionError) throw subscriptionError;

        // Calculate stats
        const stats = {
            total_students: subscriptions?.length || 0,
            active_students: subscriptions?.filter((s: InternshipSubscription) => s.status === 'active').length || 0,
            completed_students: subscriptions?.filter((s: InternshipSubscription) => s.status === 'completed').length || 0,
            total_tasks: internship.tasks?.length || 0,
            total_submissions: internship.tasks?.reduce((acc: number, task: Task) => acc + (task.submissions?.length || 0), 0) || 0,
            pending_submissions: internship.tasks?.reduce((acc: number, task: Task) => 
                acc + (task.submissions?.filter(s => s.status === 'pending').length || 0), 0) || 0,
            approved_submissions: internship.tasks?.reduce((acc: number, task: Task) => 
                acc + (task.submissions?.filter(s => s.status === 'approved').length || 0), 0) || 0,
            rejected_submissions: internship.tasks?.reduce((acc: number, task: Task) => 
                acc + (task.submissions?.filter(s => s.status === 'rejected').length || 0), 0) || 0,
            mandatory_tasks: internship.tasks?.filter((t: Task) => t.is_mandatory).length || 0,
            tasks_by_difficulty: {
                easy: internship.tasks?.filter((t: Task) => t.difficulty_level === 'easy').length || 0,
                medium: internship.tasks?.filter((t: Task) => t.difficulty_level === 'medium').length || 0,
                hard: internship.tasks?.filter((t: Task) => t.difficulty_level === 'hard').length || 0
            }
        };

        return {
            ...internship,
            stats
        };
    } catch (error) {
        console.error('Error fetching internship details:', error);
        throw error;
    }
} 