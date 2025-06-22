// SubmissionList.tsx
'use client';

import { useEffect, useState } from 'react';
import { submissionAction } from '@/action/submission.action';
import { Dialog } from '@headlessui/react';

type SupabaseResponse<T> = {
  data: T | null;
  error: string | null;
}

interface User {
  id: string;
  full_name: string;
}

interface Internship {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
  assigned_day: number;
  internship_id: string;
  internships: Internship;
}

interface Submission {
  id: string;
  user_id: string;
  task_id: string;
  users: { [key: string]: any };  // Handle Supabase response format
  tasks: { [key: string]: any };  // Handle Supabase response format
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  text_answer?: string;
  code_snippet?: string;
  external_links?: string[];
  image_urls?: string[];
  video_url?: string;
  file_url?: string;
}

export default function SubmissionList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
    const { data, error } = await submissionAction.getAllSubmissions();
      if (error) throw new Error(error);
      setSubmissions(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submissions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async (id: string) => {
    try {
    const { data, error } = await submissionAction.getSubmissionById(id);
      if (error) throw new Error(error);
    if (data) {
      setSelected(data);
      setIsOpen(true);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      const { error } = await submissionAction.updateSubmissionStatus(id, status);
      if (error) throw error;
      await fetchSubmissions();
      if (selected?.id === id) {
        const { data } = await submissionAction.getSubmissionById(id);
        if (data) setSelected(data);
      }
    } catch (error: any) {
      console.error('Error updating submission:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
          <button 
            onClick={fetchSubmissions}
            className="ml-4 underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Submissions</h2>
      {submissions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No submissions yet</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Internship</th>
              <th className="px-4 py-2 border">Task</th>
              <th className="px-4 py-2 border">Day</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Submitted At</th>
              <th className="px-4 py-2 border">View</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                  <td className="px-4 py-2 border">{s.users?.full_name || 'N/A'}</td>
                  <td className="px-4 py-2 border">{s.tasks?.internships?.title || 'N/A'}</td>
                  <td className="px-4 py-2 border">{s.tasks?.title || 'N/A'}</td>
                  <td className="px-4 py-2 border">Day {s.tasks?.assigned_day || 'N/A'}</td>
                  <td className="px-4 py-2 border">
                    <span className={`capitalize px-2 py-1 rounded text-sm ${
                      s.status === 'approved' ? 'bg-green-100 text-green-800' :
                      s.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                <td className="px-4 py-2 border">{new Date(s.submitted_at).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => openModal(s.id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
                  <td className="px-4 py-2 border">
                    {s.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(s.id, 'approved')}
                          disabled={isUpdating}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(s.id, 'rejected')}
                          disabled={isUpdating}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {isOpen && selected && (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl">
              <Dialog.Title className="text-lg font-bold mb-2">Submission Detail</Dialog.Title>
              <p className="text-sm text-gray-600 mb-1"><strong>Name:</strong> {selected.users?.full_name || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Internship:</strong> {selected.tasks?.internships?.title || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Task:</strong> {selected.tasks?.title || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Day:</strong> {selected.tasks?.assigned_day || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-3"><strong>Submitted At:</strong> {new Date(selected.submitted_at).toLocaleString()}</p>
              
              {selected.text_answer && (
                <div className="mb-3">
                  <strong className="text-sm block mb-1">Text Answer:</strong>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selected.text_answer}</p>
                </div>
              )}
              
              {selected.code_snippet && (
                <div className="mb-3">
                  <strong className="text-sm block mb-1">Code Snippet:</strong>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto"><code>{selected.code_snippet}</code></pre>
                </div>
              )}

              {selected.file_url && (
                <div className="mb-3">
                  <strong className="text-sm block mb-1">Attached File:</strong>
                  <a href={selected.file_url} className="text-blue-600 underline text-sm" target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </div>
              )}

              {selected.video_url && (
                <div className="mb-3">
                  <strong className="text-sm block mb-1">Video Submission:</strong>
                  <a href={selected.video_url} className="text-blue-600 underline text-sm" target="_blank" rel="noopener noreferrer">
                    View Video
                  </a>
                </div>
              )}

              {selected.image_urls && selected.image_urls.length > 0 && (
                <div className="mb-3">
                  <strong className="text-sm block mb-1">Image Submissions:</strong>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.image_urls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={url} alt={`Submission ${idx + 1}`} className="w-full h-40 object-cover rounded" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selected.external_links && selected.external_links.length > 0 && (
                <div className="mb-3">
                  <strong className="text-sm block mb-1">External Links:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {selected.external_links.map((link, idx) => (
                      <li key={idx}>
                        <a href={link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.status === 'pending' && (
                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    onClick={() => handleStatusUpdate(selected.id, 'approved')}
                    disabled={isUpdating}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selected.id, 'rejected')}
                    disabled={isUpdating}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
