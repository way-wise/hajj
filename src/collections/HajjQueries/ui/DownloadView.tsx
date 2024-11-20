import type { ServerSideEditViewProps } from 'payload'

import configPromise from '@payload-config'
import { Gutter } from '@payloadcms/ui'
import React from 'react'
import DownloadClient from './DownloadClient'
import { getPayload } from 'payload'

const DownloadView: React.FC<ServerSideEditViewProps> = async (props) => {
  const { initPageResult } = props

  const payload = await getPayload({ config: configPromise })
  let data = {}
  if (initPageResult && initPageResult?.docID) {
    const result = await payload.findByID({
      collection: 'hajj-queries',
      id: initPageResult?.docID as string,
      depth: 0,
    })
    if(result){
      data = result
    }
  }

  return (
    <Gutter>
      <DownloadClient data={data} showButton={true} />
    </Gutter>
  )
}

export default DownloadView
