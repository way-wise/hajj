import type { ServerSideEditViewProps } from 'payload'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from '@payloadcms/ui'
import React from 'react'
import FinalDownload from './DownloadClient'

const DownloadView: React.FC<ServerSideEditViewProps> = async (props) => {
  const { initPageResult } = props

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.findByID({
    collection: 'haj-jquery',
    id: initPageResult?.docID as string,
    depth: 2,
  })

  return (
    <Gutter>
      <FinalDownload data={result} />
    </Gutter>
  )
}

export default DownloadView
