'use client'

import React, { FC, useEffect, useState } from 'react'
import qs from 'qs'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'

const Projects: FC = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const stringifiedQuery = qs.stringify(
    {
      where: {
        clients: {
          equals: user?.id,
        },
      },
    },
    { addQueryPrefix: true },
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects${stringifiedQuery}`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setProjects(result.docs || [])
      } catch (error) {
        console.log('data not found')
      }
    }

    fetchData()
  }, [stringifiedQuery])

  if (!projects) {
    return (
      <div className="flex justify-center items-center text-center h-[200px]">
        <p className="loader-loading"></p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center text-center h-[200px]">
        <p className="loader-loading"></p>
      </div>
    )
  }


  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>
  }

  return (
    <div className="container w-full py-12 flex items-start">
      <div className="flex flex-col w-full">
        <div className="bg-main-primary text-white p-4 w-full">
          <h2 className="text-xl font-semibold">
            {user?.name ? `${user?.name}'s Projects` : 'Projects'}
          </h2>
        </div>
        <div className="py-8 w-full">
          {projects?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {projects.map((project: any, idx: number) => {
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString)
                  return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                }

                // const formattedDeadline = formatDate(project.deadline)
                // const formattedStartingDate = formatDate(project.starting_date)

                return (
                  <Link href={`/projects/${project.id}`} key={idx} className="w-full">
                    <div className="p-6 border border-gray-100 shadow-md rounded-md cursor-pointer hover:shadow-lg transition-shadow w-full">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl">{project.title}</h2>
                        <span
                          className={`text-xs px-2 py-1 rounded border inline-flex ${
                            project.status === 'approved'
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
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <h1>You do not have any project yet.</h1>
              <Link href="/">Create a new project</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects
