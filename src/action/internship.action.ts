import { supabase } from "@/lib/supabase";

export type InternshipMode = 'online' | 'offline' | 'hybrid';
export type InternshipStatus = 'upcoming' | 'ongoing' | 'completed';
export type PriceType = 'free' | 'paid';

export interface CertificateTemplate {
    completion?: {
        title: string;
        template: string;
    };
    internship?: {
        title: string;
        template: string;
    };
}

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
    certificate_template: CertificateTemplate | null;
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
    certificate_template?: CertificateTemplate;
    stats?: InternshipStats;
    tasks?: Array<{
        id: string;
        title: string;
        assigned_day: number;
        difficulty_level: 'easy' | 'medium' | 'hard';
        is_mandatory: boolean;
        submissions?: Array<{
            id: string;
            status: 'pending' | 'approved' | 'rejected';
            submitted_at: string;
        }>;
    }>;
}

export async function createInternship(data: CreateInternshipInput) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        // Generate slug from title
        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .insert([{
                ...data,
                created_by: userData.user.id,
                slug,
                // Ensure all array fields are properly handled
                tags: data.tags || [],
                mentors: data.mentors || [],
                features: data.features || [],
                requirements: data.requirements || [],
                benefits: data.benefits || [],
                // Set default values for required fields
                price_type: data.price_type || 'free',
                price_value: data.price_value || 0,
                mode: data.mode || 'online',
                status: data.status || 'upcoming',
                is_published: data.is_published || false
            }])
            .select()
            .single();

        if (internshipError) throw internshipError;
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
            .select('*')
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
        // Generate slug from title if title is being updated
        const slug = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined;

        // Remove any computed fields that might have been passed
        const { stats, tasks, ...updateData } = data;

        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .update({
                ...updateData,
                slug,
                // Ensure all array fields are properly handled
                tags: updateData.tags || [],
                mentors: updateData.mentors || [],
                features: updateData.features || [],
                requirements: updateData.requirements || [],
                benefits: updateData.benefits || [],
                // Ensure certificate template is properly handled
                certificate_template: updateData.certificate_template ? {
                    completion: updateData.certificate_template.completion || { title: '', template: '' },
                    internship: updateData.certificate_template.internship || { title: '', template: '' }
                } : undefined,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (internshipError) throw internshipError;
        return internship;
    } catch (error) {
        console.error('Error updating internship:', error);
        throw error;
    }
}

export async function getInternshipById(id: string) {
    try {
        const { data: internship, error: internshipError } = await supabase
            .from('internships')
            .select(`
                *,
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
            active_students: subscriptions?.filter((s: { status: string }) => s.status === 'active').length || 0,
            completed_students: subscriptions?.filter((s: { status: string }) => s.status === 'completed').length || 0,
            total_tasks: internship.tasks?.length || 0,
            total_submissions: internship.tasks?.reduce((acc: number, task: { submissions?: any[] }) => 
                acc + (task.submissions?.length || 0), 0) || 0,
            pending_submissions: internship.tasks?.reduce((acc: number, task: { submissions?: any[] }) => 
                acc + (task.submissions?.filter((s: { status: string }) => s.status === 'pending').length || 0), 0) || 0,
            approved_submissions: internship.tasks?.reduce((acc: number, task: { submissions?: any[] }) => 
                acc + (task.submissions?.filter((s: { status: string }) => s.status === 'approved').length || 0), 0) || 0,
            rejected_submissions: internship.tasks?.reduce((acc: number, task: { submissions?: any[] }) => 
                acc + (task.submissions?.filter((s: { status: string }) => s.status === 'rejected').length || 0), 0) || 0,
            mandatory_tasks: internship.tasks?.filter((t: { is_mandatory: boolean }) => t.is_mandatory).length || 0,
            tasks_by_difficulty: {
                easy: internship.tasks?.filter((t: { difficulty_level: string }) => t.difficulty_level === 'easy').length || 0,
                medium: internship.tasks?.filter((t: { difficulty_level: string }) => t.difficulty_level === 'medium').length || 0,
                hard: internship.tasks?.filter((t: { difficulty_level: string }) => t.difficulty_level === 'hard').length || 0
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