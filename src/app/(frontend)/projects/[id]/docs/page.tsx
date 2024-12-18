'use client'

import { useEffect, useState } from 'react'
import qs from 'qs'
import RichText from '@/components/RichText'
import { useParams } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

const ProjectDocsPage = () => {
    const { id:projectId } = useParams()
    const {user} = useAuth()

  const [docs, setDocs] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const query = qs.stringify(
    {
      where: {
        user: {
          equals: user?.id,
        },

        project: {
          equals: projectId,
        },
      },
    },
    { addQueryPrefix: true },
  )

  useEffect(() => {
    const fetchProjectDocsPage = async () => {
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

    fetchProjectDocsPage()
  }, [query])
  if (loading) return <p>Loading...</p>

  return <div className='py-5'>
    {
      docs?.map((doc)=>{
        return  <RichText key={doc.id} data={doc?.content} />
      })
    }
  </div>
}

export default ProjectDocsPage
