import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'

import configPromise from '@payload-config'
import { HajjTemplate } from './page.client'
import { HajjQuery } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'

type Args = {
  params: Promise<{
    id?: string
  }>
}

export default async function PagePreview({ params: paramsPromise }: Args) {
  const { id } = await paramsPromise
  const url = '/'
  console.log(id)

  let hajj: HajjQuery | null = null

  const payload = await getPayloadHMR({ config: configPromise })

  if (id) {
    hajj = await payload.findByID({
      collection: 'hajj-queries',
      id: id,
    })
  }

  if (!hajj) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="">
      <HajjTemplate hajj={hajj} />
    </article>
  )
}
