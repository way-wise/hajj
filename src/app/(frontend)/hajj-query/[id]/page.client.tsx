'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { HajjQuery } from '@/payload-types'
import DownloadClient from '@/collections/HajjQueries/ui/DownloadClient'
require('./hajj-query.css')

export const HajjTemplate: React.FC<{ hajj: HajjQuery | null | undefined }> = ({ hajj }) => {


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
