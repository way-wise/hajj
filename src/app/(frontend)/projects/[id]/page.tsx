'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!id) return;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setProject(result);
            } catch (error) {
                console.error('Failed to fetch project details', error);
            }
        };

        fetchProjectDetails();
    }, [id]);

    if (!project) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="container mx-auto py-12 px-6 md:px-12 lg:px-24">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gray-100 to-cyan-500 p-8 text-white">
                    <h1 className="text-3xl text-black font-bold mb-2">{project.title}</h1>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Project Details</h2>
                            <div className="mt-4 text-sm text-gray-600">
                                <p className="mb-2"><strong>Status:</strong> <span className={`px-2 py-1 rounded-md ${getStatusStyle(project.status)}`}>{project.status}</span></p>
                                <p className="mb-2"><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</p>
                                <p><strong>Starting Date:</strong> {new Date(project.starting_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700">Financial Summary</h2>
                            <div className="mt-4 text-sm text-gray-600">
                                <p className="mb-2"><strong>Payable Amount:</strong> ${project.payable_amount.toFixed(2)}</p>
                                <p className="mb-2"><strong>Paid Amount:</strong> ${project.paid_amount.toFixed(2)}</p>
                                <p><strong>Due Amount:</strong> ${project.due_amount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${project.progress}%`,
                                    background: project.progress < 50
                                        ? 'linear-gradient(to right, #f87171, #ef4444)'
                                        : 'linear-gradient(to right, #34d399, #10b981)',
                                    transition: 'width 0.4s ease',
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="p-6 my-6 rounded-lg border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800">Project Features</h2>
                        <ul className="mt-4 grid gap-4 md:grid-cols-2">
                            {project?.projectFeatures.map((item: any, index: number) => (
                                <li key={index} className="space-y-3 p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`font-medium p-1 rounded ${item.isComplete === true ? 'bg-green-100 text-green-800' : 'text-gray-700'}`}
                                        >
                                            {item.featureName}
                                        </span>
                                        <span className="text-gray-700 font-medium">{item.featureProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${item.featureProgress}%`,
                                                background: item.featureProgress < 50
                                                    ? 'linear-gradient(to right, #f87171, #ef4444)'
                                                    : 'linear-gradient(to right, #34d399, #10b981)',
                                                transition: 'width 0.4s ease',
                                            }}
                                        ></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800">Additional Information</h2>
                        <p className="text-black mt-4">{project.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;

// Utility function for status styling
function getStatusStyle(status: string) {
    switch (status) {
        case 'approved':
            return 'bg-green-200 text-green-800';
        case 'pending':
            return 'bg-red-200 text-red-800';
        case 'ongoing':
            return 'bg-yellow-200 text-yellow-800';
        case 'complete':
            return 'bg-blue-200 text-blue-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
}
