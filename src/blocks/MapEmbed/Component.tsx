import { cn } from 'src/utilities/cn'
import React from 'react'

import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'

type Props = Extract<Page['layout'][0], { blockType: 'mapEmbed' }> & {
  className?: string
  enableGutter?: boolean
}

export const MapEmbed: React.FC<Props> = (props) => {
  const {
    className,
    position = 'default',
    richText,
    mapHeight = 400,
    mapCode = '!1m14!1m8!1m3!1d767.5333210581206!2d90.39493668597375!3d23.782147378671215!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7e0b4f3e5fd%3A0x9e725404cc12432d!2sWay%20Wise%20Global!5e0!3m2!1sen!2sus!4v1728289161527!5m2!1sen!2sus'
  } = props

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
      {richText && (
        <div
          className="mt-12 mb-6 max-w-[56rem] mx-auto">
          <RichText content={richText} enableGutter={true} />
        </div>
      )}
      <div className={`w-full h-${mapHeight}`} style={{ height: mapHeight + 'px' }}>
        <iframe
          src={`https://www.google.com/maps/embed?pb=${mapCode}`}
          width="100%" height={`${mapHeight}`} style={{ border: '0' }} loading="lazy"></iframe>
      </div>
    </div>
  )
}
