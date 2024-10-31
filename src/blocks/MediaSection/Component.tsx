import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'mediaSection' }> & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  id?: string
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaSection: React.FC<Props> = (props) => {
  const {
    className,
    enableGutter = true,
    imgClassName,
    media,
    richText,
    links,
    position = 'default',
    staticImage,
    background,
    bgColor,
    startColor,
    endColor,
    angle,
  } = props

  return (
    <div
      className={cn(
        'relative min-h-56 md:min-h-80',
        {
          'container my-8': position === 'default' && enableGutter,
        },
        className,
      )}
    >
      {background === 'color' && (
        <div className="w-full min-h-56 md:min-h-80" style={{ backgroundColor: bgColor as string }}></div>
      )}
      {background === 'gradient' && (
        <div
          className={`w-full min-h-56 md:min-h-80 ${position === 'default' && enableGutter && 'rounded-2xl'}`}
          style={{
            backgroundImage: `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`,
          }}
        ></div>
      )}
      {background === 'image' &&
        media &&
        (position === 'fullscreen' ? (
          <div className={`relative min-h-[450px]`}>
            <Media
              fill
              resource={media}
              src={staticImage}
              imgClassName={cn('-z-10 object-cover', imgClassName)}
            />
          </div>
        ) : (
          <Media
            imgClassName={cn('rounded-2xl', imgClassName)}
            resource={media}
            src={staticImage}
          />
        ))}
      <div className="absolute left-0 top-0 w-full h-full">
        <div className="container h-full">
          <div className="p-4 flex flex-col gap-8 justify-center items-center h-full">
            <div className="max-w-[48rem] flex items-center text-white text-shadow shadow-gray-900">
              {richText && <RichText className="mb-0" content={richText} enableGutter={false} />}
            </div>
            <div className="flex flex-col gap-8">
              {(links || []).map(({ link }, i) => {
                return <CMSLink key={i} size="lg" {...link} />
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
