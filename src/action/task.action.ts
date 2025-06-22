import { supabase } from "@/lib/supabase";

export type TaskDifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Task {
    id: string;
    internship_id: string;
    title: string;
    description: string | null;
    order_no: number | null;
    assigned_day: number;
    resource_links: string[] | null;
    reference_links: string[] | null;
    hints: string[] | null;
    attachment_urls: string[] | null;
    expected_output: string | null;
    submission_format: string | null;
    evaluation_criteria: string[] | null;
    estimated_time_hrs: number | null;
    difficulty_level: TaskDifficultyLevel;
    video_tutorial_url: string | null;
    tags: string[] | null;
    is_mandatory: boolean;
    created_at: string;
}

export interface CreateTaskInput {
    internship_id: string;
    title: string;
    description?: string;
    order_no?: number;
    assigned_day: number;
    resource_links?: string[];
    reference_links?: string[];
    hints?: string[];
    attachment_urls?: string[];
    expected_output?: string;
    submission_format?: string;
    evaluation_criteria?: string[];
    estimated_time_hrs?: number;
    difficulty_level?: TaskDifficultyLevel;
    video_tutorial_url?: string;
    tags?: string[];
    is_mandatory?: boolean;
}

export async function createTask(data: CreateTaskInput) {
    try {
        const { data: task, error } = await supabase
            .from('tasks')
            .insert([{
                ...data,
                // Ensure all array fields are properly handled
                resource_links: data.resource_links || [],
                reference_links: data.reference_links || [],
                hints: data.hints || [],
                attachment_urls: data.attachment_urls || [],
                evaluation_criteria: data.evaluation_criteria || [],
                tags: data.tags || [],
                // Set default values
                difficulty_level: data.difficulty_level || 'medium',
                is_mandatory: data.is_mandatory ?? true
            }])
            .select()
            .single();

        if (error) throw error;
        return task;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

export async function getTasksByInternship(internshipId: string) {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('internship_id', internshipId)
            .order('assigned_day', { ascending: true })
            .order('order_no', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

export async function updateTask(id: string, data: Partial<CreateTaskInput>) {
    try {
        const { data: task, error } = await supabase
            .from('tasks')
            .update({
                ...data,
                // Ensure all array fields are properly handled
                resource_links: data.resource_links || [],
                reference_links: data.reference_links || [],
                hints: data.hints || [],
                attachment_urls: data.attachment_urls || [],
                evaluation_criteria: data.evaluation_criteria || [],
                tags: data.tags || []
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return task;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

export async function deleteTask(id: string) {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

export async function getInternshipDuration(internshipId: string) {
    try {
        const { data, error } = await supabase
            .from('internships')
            .select('duration_days')
            .eq('id', internshipId)
            .single();

        if (error) throw error;
        return data.duration_days;
    } catch (error) {
        console.error('Error fetching internship duration:', error);
        throw error;
    }
} 