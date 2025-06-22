import { supabase } from "@/lib/supabase";

export type TaskDifficultyLevel = 'easy' | 'medium' | 'hard';

export interface CourseTask {
    id: string;
    course_id: string;
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

export interface CreateCourseTaskInput {
    course_id: string;
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

export async function createCourseTask(data: CreateCourseTaskInput) {
    try {
        const { data: task, error } = await supabase
            .from('course_tasks')
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
        console.error('Error creating course task:', error);
        throw error;
    }
}

export async function getTasksByCourse(courseId: string) {
    try {
        const { data, error } = await supabase
            .from('course_tasks')
            .select('*')
            .eq('course_id', courseId)
            .order('assigned_day', { ascending: true })
            .order('order_no', { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching course tasks:', error);
        throw error;
    }
}

export async function updateCourseTask(id: string, data: Partial<CreateCourseTaskInput>) {
    try {
        const { data: task, error } = await supabase
            .from('course_tasks')
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
        console.error('Error updating course task:', error);
        throw error;
    }
}

export async function deleteCourseTask(id: string) {
    try {
        const { error } = await supabase
            .from('course_tasks')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting course task:', error);
        throw error;
    }
}

export async function getCourseDuration(courseId: string) {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('duration_days')
            .eq('id', courseId)
            .single();

        if (error) throw error;
        return data.duration_days;
    } catch (error) {
        console.error('Error fetching course duration:', error);
        throw error;
    }
} 