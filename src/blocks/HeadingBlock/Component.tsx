import React from 'react'

import type { HeadingBlock as HeadingBlockProps } from '@/payload-types'

type Props = HeadingBlockProps & {
  text?: string | null
  fontSize?: number | null
  fontWeight?: string | null
  fontStyle?: string | null
  id?: string | null
}

export const HeadingBlock: React.FC<Props> = (props) => {
  const { text, fontSize, fontStyle, fontWeight, textAlign, color } = props

  const style = {
    fontSize: fontSize ? `${fontSize}px` : '32px',
    fontStyle: fontStyle || 'normal',
    fontWeight: fontWeight || '600',
    textAlign: textAlign || 'left',
    color: color || 'red',
  }

  return (
    <>
      <div style={style}>{text}</div>
    </>
  )
}
