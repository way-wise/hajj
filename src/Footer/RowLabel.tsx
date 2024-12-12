'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = (props) => {
  const data = useRowLabel<NonNullable<Footer['footerNavItems']>[number]>()

  const label = data?.data?.navTitle
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.navTitle}`
    : 'Row'

  return <div>{label}</div>
}
