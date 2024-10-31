import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export type Props = Extract<Page['layout'][0], { blockType: 'serviceSection' }> & {
  hideBackground?: boolean
}
export const ServiceSection: React.FC<Props> = (props) => {
  const { services, column, fixedBackground, intro, backgroundImage } = props
  const background =
    backgroundImage && typeof backgroundImage === 'object' ? backgroundImage.url : ''
  const isFixed = fixedBackground ? 'fixed' : 'scroll'
  const columnClass = column ? 'grid-cols-' + column : 'grid-cols-4'
  return (
    <div
      style={{ backgroundImage: `url('${background}')`, backgroundAttachment: isFixed }}
      className="bg-no-repeat bg-cover bg-center py-12 md:py-20 lg:py-32"
    >
      {intro && (
        <div className="container max-w-3xl mb-12 m-auto">
          <div className="md:p-6 text-shadow-sm shadow-gray-700">
            <RichText className="text-white" content={intro} enableGutter={false} />
          </div>
        </div>
      )}
      {services && services.length > 0 && (
        <div className="container md:px-8 m-auto">
          <div className={`grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:${columnClass}`}>
            {services.map((service, index) => (
              <div
                key={index}
                className={`h-full flex bg-gray-800/20 backdrop-blur-md rounded-xl overflow-hidden group hover:bg-gray-800/70 transition duration-500 ease-in-out
                ${service?.alignment === 'mediaContent' ? 'flex-col' : 'flex-col-reverse'}
                ${(index + 1) % 2 == 0 ? 'items-end' : 'items-start'}
                `}
              >
                <div className="h-64 w-full relative">
                  {service?.contentImage && typeof service?.contentImage === 'object' && (
                    <React.Fragment>
                      <Media
                        fill
                        priority
                        resource={service?.contentImage}
                        imgClassName="object-cover"
                      />
                    </React.Fragment>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-blue-700 bg-fixed opacity-0 transition duration-300 ease-in-out group-hover:opacity-50"></div>
                </div>
                <div className="flex p-4 md:p-6 text-shadow-sm shadow-gray-700">
                  {service?.richText && (
                    <RichText
                      className="text-white"
                      content={service?.richText}
                      enableGutter={false}
                    />
                  )}
                  {service?.enableLink && service?.link && (
                    <div className="w-full mt-4 block md:mt-8">
                      <CMSLink {...service?.link} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
