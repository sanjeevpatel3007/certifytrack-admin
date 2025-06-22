// submission.action.ts
import { supabase } from '@/lib/supabase';

export const submissionAction = {
  // Fetch all submissions with user and task details
  getAllSubmissions: async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          status,
          submitted_at,
          user_id,
          task_id,
          users!submissions_user_id_fkey (
            id,
            full_name
          ),
          tasks!submissions_task_id_fkey (
            id,
            title,
            assigned_day,
            internship_id,
            internships (
              id,
              title
            )
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      return { data: null, error: error.message || 'Failed to fetch submissions' };
    }
  },

  // Fetch full data for a specific submission
  getSubmissionById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          status,
          submitted_at,
          text_answer,
          code_snippet,
          external_links,
          file_url,
          image_urls,
          video_url,
          user_id,
          task_id,
          users!submissions_user_id_fkey (
            id,
            full_name
          ),
          tasks!submissions_task_id_fkey (
            id,
            title,
            assigned_day,
            internship_id,
            internships (
              id,
              title
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching submission details:', error);
      return { data: null, error: error.message || 'Failed to fetch submission details' };
    }
  },

  // Update submission status (approve/reject)
  updateSubmissionStatus: async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error updating submission status:', error);
      return { error: error.message || 'Failed to update submission status' };
    }
  }
};