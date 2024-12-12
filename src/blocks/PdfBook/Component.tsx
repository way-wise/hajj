'use client'

import { cn } from 'src/utilities/cn'
import React from 'react'

import type { PdfBook as PdfBookProps } from '@/payload-types'
import RichText from '@/components/RichText'
import FlipBook from './FlipBook'

type Props = PdfBookProps & {
  className?: string
  enableGutter?: boolean
}

export const PdfBook: React.FC<Props> = (props) => {
  const { className, position = 'default', introText, height = 400, width = 600, document } = props

  return (
    <div
      className={cn(
        '',
        {
          container: position === 'default',
        },
        className,
      )}
    >
      {introText && (
        <div className="mt-12 mb-6 max-w-[56rem] mx-auto">
          <RichText data={introText} enableGutter={true} />
        </div>
      )}
      <div className="w-full h-[80vh]">
      {document && typeof document === 'object' && document.url !== undefined && (
        <FlipBook document={document.url as string} height={height || 200} width={width || 300} />
      )}
      </div>
    </div>
  )
}
