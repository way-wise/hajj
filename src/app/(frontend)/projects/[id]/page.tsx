'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

const ProjectDetails: React.FC = () => {
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects/${id}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setProject(result)
      } catch (error) {
        console.error('Failed to fetch project details', error)
      }
    }

    fetchProjectDetails()
  }, [id])

  if (!project) {
    return (
      <div className="flex justify-center items-center text-center h-[200px]">
        <p className="loader-loading"></p>
      </div>
    )
  }

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-black">Project Details</h2>
        <div className="mt-2 text-sm text-black">
          <p className="mb-2">
            <strong>Status:</strong> <Badge variant={'success'}>{project.status}</Badge>{' '}
          </p>
          <p className="mb-2">
            <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
          </p>
          <p>
            <strong>Starting Date:</strong> {new Date(project.starting_date).toLocaleDateString()}
          </p>
        </div>
        <h2 className="text-lg font-semibold text-black mt-8">Financial Summary</h2>
        <div className="mt-2 text-sm text-black">
          <p className="mb-2">
            <strong>Payable Amount:</strong> ${project.payable_amount.toFixed(2)}
          </p>
          <p className="mb-2">
            <strong>Paid Amount:</strong> ${project.paid_amount.toFixed(2)}
          </p>
          <p>
            <strong>Due Amount:</strong> ${project.due_amount.toFixed(2)}
          </p>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">Additional Information</h2>
            <p className="text-black mt-4">{project.description}</p>
          </div>
        </div>
        <div className="p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="pb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-black">Project overall progress</h2>
              <p>{project?.progress}%</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${project.progress}%`,
                  background: 'linear-gradient(to right, #34d399, #10b981)',
                  transition: 'width 0.4s ease',
                }}
              ></div>
            </div>
          </div>

          {/* <div>
            <h2 className="text-lg font-semibold text-black">Project Feature List</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {project?.projectFeatures.map((item: any, index: number) => (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg shadow hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {(item.isComplete && item.isComplete === true) ||
                      item.featureProgress === 100 ? (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 48 48"
                          fill="#19BF87"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M18 32.34L9.66 24l-2.82 2.82L18 38 42 14l-2.82-2.82L18 32.34z"
                            stroke="#19BF87"
                            strokeWidth="2"
                          />
                        </svg>
                      ) : (
                        <div className="loader-spinner"></div>
                      )}
                    </div>
                    <div className="w-full h-full space-y-3 pr-4 py-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium rounded text-black">{item.featureName}</p>
                        <span className="text-black font-medium">{item.featureProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.featureProgress}%`,
                            background: 'linear-gradient(to right, #34d399, #10b981)',
                            transition: 'width 0.4s ease',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      <div className='md:mt-8'>
        <h2 className="text-lg font-semibold text-black">Project Feature List</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {project?.projectFeatures.map((item: any, index: number) => (
            <li
              key={index}
              className="border border-gray-200 rounded-lg shadow hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center">
                  {(item.isComplete && item.isComplete === true) ||
                    item.featureProgress === 100 ? (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 48 48"
                      fill="#19BF87"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 32.34L9.66 24l-2.82 2.82L18 38 42 14l-2.82-2.82L18 32.34z"
                        stroke="#19BF87"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <div className="loader-spinner"></div>
                  )}
                </div>
                <div className="w-full h-full space-y-3 pr-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium rounded text-black">{item.featureName}</p>
                    <span className="text-black font-medium">{item.featureProgress}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.featureProgress}%`,
                        background: 'linear-gradient(to right, #34d399, #10b981)',
                        transition: 'width 0.4s ease',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectDetails

// Utility function for status styling
function getStatusStyle(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-200 text-green-800'
    case 'pending':
      return 'bg-red-200 text-red-800'
    case 'ongoing':
      return 'bg-yellow-200 text-yellow-800'
    case 'complete':
      return 'bg-blue-200 text-blue-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}
