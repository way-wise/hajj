import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'

import configPromise from '@payload-config'
import { HajjTemplate } from './page.client'
import { HajjQuery } from '@/payload-types'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{
    id?: string
  }>
}

export default async function PagePreview({ params: paramsPromise }: Args) {
  const { id } = await paramsPromise
  const url = '/'

  let hajj: HajjQuery | null = null

  const payload = await getPayload({ config: configPromise })

  if (id) {
    hajj = await payload.findByID({
      collection: 'hajj-queries',
      id: id,
    })
  }

  return <article className="">{hajj && <HajjTemplate hajj={hajj} />}</article>
}
