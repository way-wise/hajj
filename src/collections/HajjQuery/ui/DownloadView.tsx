import type { ServerSideEditViewProps } from 'payload'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from '@payloadcms/ui'
import React from 'react'
import DownloadClient from './DownloadClient'

const DownloadView: React.FC<ServerSideEditViewProps> = async (props) => {
  const {
    initPageResult: { docID },
  } = props

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.findByID({
    collection: 'haj-jquery',
    id: docID as string,
    depth: 2,
  })

  return (
    <Gutter>
      <DownloadClient data={result} />
    </Gutter>
  )
}

export default DownloadView
