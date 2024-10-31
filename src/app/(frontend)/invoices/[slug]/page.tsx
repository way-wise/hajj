import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'
import configPromise from '@payload-config'
import type { Invoice as InvoiceType } from '@/payload-types'
import { InvoiceTemplate } from './page.client'
import { getPayloadHMR } from '@payloadcms/next/utilities'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function InvoicePreview({ params: paramsPromise }: Args) {
  const { slug = 'main' } = await paramsPromise
  const url = '/' + slug

  let invoice: InvoiceType | null

  const payload = await getPayloadHMR({ config: configPromise })
  const invoiceRes = await payload.find({
    collection: 'invoices',
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  invoice = invoiceRes?.docs?.[0] ?? null

  if (!invoice) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="">
      {/* Allows redirects for valid invoices too */}
      <PayloadRedirects disableNotFound url={url} />

      <InvoiceTemplate invoice={invoice} />
    </article>
  )
}
