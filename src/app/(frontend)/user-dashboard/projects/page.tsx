'use client'

import React, { FC } from 'react';
import qs from 'qs'
import { useAuth } from '@/providers/Auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface ProjectsProps {

}

const Projects: FC<ProjectsProps> = () => {

    const { user } = useAuth()

    if (!user) {
        redirect(`/`)
    }

    const clientId = user?.id;

    const stringifiedQuery = qs.stringify(
        {
            where: {
                clients: {
                    equals: clientId
                },
                status: {
                    equals: 'approved'
                }
            },
        },
        { addQueryPrefix: true },
    )

    const [projects, setProjects] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects${stringifiedQuery}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setProjects(result.docs || []);
            }
            catch (error) {
                console.log('data not found')
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col lg:h-auto min-h-max w-full">
            <div className="bg-main-primary text-white p-4">
                <h2 className="text-xl font-semibold">Projects</h2>
            </div>
            <div className="p-8">
                {projects?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6">
                        {projects.map((project: any, idx: number) => {
                            const formatDate = (dateString: string) => {
                                const date = new Date(dateString);
                                return date.toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                });
                            };

                            const formattedDeadline = formatDate(project.deadline);
                            const formattedStartingDate = formatDate(project.starting_date);
                            return (
                                <div className="p-6 border border-gray-100 shadow-md rounded-md" key={idx}>
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl">{project.title}</h2>
                                        <span
                                            className={`text-xs px-2 py-1 rounded border inline-flex
                                        ${project.status === 'approved'
                                                    ? 'bg-green-300 border-green-500'
                                                    : project.status === 'decline'
                                                        ? 'bg-rose-300 border-rose-500'
                                                        : project.status === 'ongoing'
                                                            ? 'bg-cyan-300 border-cyan-500'
                                                            : project.status === 'complete'
                                                                ? 'bg-blue-300 border-blue-500'
                                                                : 'bg-gray-300 border-gray-500'
                                                }`}
                                        >
                                            {project.status}
                                        </span>
                                    </div>
                                    <p className="mt-5 text-sm">{project.description}</p>
                                    <div className="mt-6">
                                        <div className="[&_h4]:text-base [&_h4]:text-gray-900 [&_h4]:py-2 divide-y [&_h4]:font-semibold [&_span]:font-normal [&_h4]:flex [&_h4]:justify-between [&_h4]:items-center">
                                            <h4>Project Deadline: <span>{formattedDeadline}</span></h4>
                                            <h4>Starting Date: <span>{formattedStartingDate}</span></h4>
                                            <h4>Payable Amount: <span>${project.payable_amount}</span></h4>
                                            <h4>Paid Amount: <span>${project.paid_amount}</span></h4>
                                            <h4>Due Amount: <span>${project.due_amount}</span></h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        <h1>You do not have any project yet.</h1>
                        <Link href='/'>Create a new project</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
