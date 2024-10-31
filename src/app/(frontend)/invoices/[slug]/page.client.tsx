'use client'

import { Invoice } from '@/payload-types'
import InvoiceTheme1 from '@/components/Invoice/Theme1'
import InvoiceTheme2 from '@/components/Invoice/Theme2'

const themes = {
  theme1: InvoiceTheme1,
  theme2: InvoiceTheme2,
}

export const InvoiceTemplate: React.FC<{ invoice: Invoice | null | undefined }> = ({ invoice }) => {

  const { theme } = invoice?.details?.invoiceDetails || {}

  if (!theme) return null

  const InvoiceToRender = themes[theme]

  if (!InvoiceToRender) return null
  {/* @ts-expect-error */}
  return <InvoiceToRender {...invoice} />
}
