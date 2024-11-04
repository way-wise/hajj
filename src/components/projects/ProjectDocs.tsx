'use client'

import { useEffect, useState } from 'react'
import qs from 'qs'
import RichText from '../RichText'

const ProjectDocs = ({ projectId, userId }) => {
  const [docs, setDocs] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const query = qs.stringify(
    {
      where: {
        user: {
          equals: userId,
        },

        project: {
          equals: projectId,
        },
      },
    },
    { addQueryPrefix: true },
  )

  useEffect(() => {
    const fetchProjectDocs = async () => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/project-documentations/${query}`
      setLoading(true)
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()

        setDocs(result?.docs)
      } catch (error) {
        console.error('Failed to fetch project documentation', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDocs()
  }, [query])
  if (loading) return <p>Loading...</p>

  return (
    <div>
      <RichText content={docs?.content} />
    </div>
  )
}

export default ProjectDocs
