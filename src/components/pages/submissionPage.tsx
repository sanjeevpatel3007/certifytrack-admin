'use client';

import SubmissionList from "../submission/SubmissionList";

export default function SubmissionPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1>Submission Page</h1>
                <SubmissionList />
            </div>
        </div>
    );
} 