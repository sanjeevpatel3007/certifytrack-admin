'use client';

import React from 'react';

const InternshipPage = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Internship Management</h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Create New Internship
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Active Internships</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Completed Internships</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Recent Internships</h2>
                </div>
                
                <div className="p-4">
                    <div className="text-gray-500 text-center py-8">
                        No internships found. Create your first internship program to get started.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InternshipPage;