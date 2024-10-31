import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'

import type { Page as PageType } from '@/payload-types'
import { PageTemplate } from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function PagePreview({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: PageType | null

  const pageRes: {
    docs: PageType[]
  } = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=${slug}&depth=10`,
    {
      method: 'GET',
    },
  ).then((res) => res.json())

  page = pageRes?.docs?.[0] ?? null

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <PageTemplate page={page} />
    </article>
  )
}
