import { supabase } from "@/lib/supabase";

export interface DashboardStats {
    totalUsers: number;
    totalCourses: number;
    totalInternships: number;
    totalTasks: number;
    totalSubmissions: number;
    totalCertificates: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        // Get total users (excluding admin users)
        const { count: userCount, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'user');

        if (userError) throw userError;

        // Get total courses
        const { count: courseCount, error: courseError } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true });

        if (courseError) throw courseError;

        // Get total internships
        const { count: internshipCount, error: internshipError } = await supabase
            .from('internships')
            .select('*', { count: 'exact', head: true });

        if (internshipError) throw internshipError;

        // Get total tasks (both course tasks and internship tasks)
        const { count: taskCount, error: taskError } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true });

        if (taskError) throw taskError;

        const { count: courseTaskCount, error: courseTaskError } = await supabase
            .from('course_tasks')
            .select('*', { count: 'exact', head: true });

        if (courseTaskError) throw courseTaskError;

        // Get total submissions (both course and internship submissions)
        const { count: submissionCount, error: submissionError } = await supabase
            .from('task_submissions')
            .select('*', { count: 'exact', head: true });

        if (submissionError) throw submissionError;

        const { count: courseSubmissionCount, error: courseSubmissionError } = await supabase
            .from('course_task_submissions')
            .select('*', { count: 'exact', head: true });

        if (courseSubmissionError) throw courseSubmissionError;

        // Get total certificates issued
        const { count: certificateCount, error: certificateError } = await supabase
            .from('issued_certificates')
            .select('*', { count: 'exact', head: true });

        if (certificateError) throw certificateError;

        return {
            totalUsers: userCount || 0,
            totalCourses: courseCount || 0,
            totalInternships: internshipCount || 0,
            totalTasks: (taskCount || 0) + (courseTaskCount || 0),
            totalSubmissions: (submissionCount || 0) + (courseSubmissionCount || 0),
            totalCertificates: certificateCount || 0
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
} 