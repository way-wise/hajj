'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { HajjQuery } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'
import DownloadClient from '@/collections/HajjQueries/ui/DownloadClient'

export const HajjTemplate: React.FC<{ hajj: HajjQuery | null | undefined }> = ({ hajj }) => {
  const router = useRouter()
  const { user } = useAuth()

  if (!user) {
    router.push('/')
  }

  if (user && !user?.roles?.includes('admin')) {
    router.push('/')
  }

  const { data } = useLivePreview({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
    initialData: hajj,
  })
  if (!data) {
    console.log('hajj not found')
    return
  }

  return <DownloadClient data={data} showButton={false} />
}
