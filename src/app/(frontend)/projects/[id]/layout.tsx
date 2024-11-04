import { getCollections } from '@/utilities/getCollections'
import Link from 'next/link'
import React from 'react'

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) => {
  const projectId = params.id

  const project: any = await getCollections({
    collection: 'projects',
    where: {
      id: {
        equals: projectId,
      },
    },
    isOne: true,
  })()

  return (
    <div className="container mx-auto py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-100 to-cyan-500 p-8 text-white">
          <h1 className="text-3xl text-black font-bold mb-2">{project?.title}</h1>
        </div>
        <div className="*:px-3 *:py-2 *:border-r *:border-t  *:border-b  *:border-primary *:capitalize ml-10 mt-5">
          <Link href={`/projects/${projectId}/docs`} className="first:border-l">
            docs
          </Link>
          <Link href={`/projects/${projectId}/assets`}>assets</Link>
          <Link href={`/projects/${projectId}/inbox`}>inbox</Link>
        </div>

        <div className="px-10 py-5 w-full">{children}</div>
      </div>
    </div>
  )
}

export default layout
