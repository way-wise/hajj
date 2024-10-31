import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export type Props = Extract<Page['layout'][0], { blockType: 'featureSection' }> & {
  hideBackground?: boolean
}
export const FeatureSection: React.FC<Props> = (props) => {
  const {
    background,
    fixedBackground,
    alignment,
    featureImage1,
    featureImage2,
    abstructImageTop,
    abstructImageBottom,
    richText,
    enableLink,
    link,
  } = props
  const backgroundImage =  background && typeof background === 'object' ? background.url : ''
   const isFixed = fixedBackground ? 'fixed' : 'scroll'
  return (
    <section
     style={{ backgroundImage: `url('${backgroundImage}')`, backgroundAttachment: isFixed }}
      className="bg-no-repeat bg-cover bg-left md:bg-center py-12 md:py-20 lg:py-[120px] relative">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-[92px] lg:gap-10 2xl:gap-[92px] items-center">
          <div
            className={`relative z-10 w-full h-full ${alignment === 'mediaContent' ? 'order-first' : 'order-last'}`}
          >
            {abstructImageTop && typeof abstructImageTop === 'object' && (
              <div className="absolute top-0 left-0">
                <React.Fragment>
                  <Media priority resource={abstructImageTop} imgClassName="" />
                </React.Fragment>
              </div>
            )}
            {featureImage1 && typeof featureImage1 === 'object' && (
              <div className="absolute top-0 right-0  w-[65%] h-[80%]">
                <React.Fragment>
                  <Media
                    fill
                    priority
                    resource={featureImage1}
                    imgClassName="object-cover rounded-2xl"
                  />
                </React.Fragment>
              </div>
            )}
            {featureImage2 && typeof featureImage2 === 'object' && (
              <div className="absolute bottom-0 left-0 w-[55%] h-[70%] border-t-[15px] border-r-[15px] border-white dark:border-gray-900 rounded-2xl">
                <React.Fragment>
                  <Media
                    fill
                    priority
                    resource={featureImage2}
                    imgClassName="object-cover rounded-2xl"
                  />
                </React.Fragment>
              </div>
            )}
            {abstructImageBottom && typeof abstructImageBottom === 'object' && (
              <div
                className="absolute bottom-0 right-0"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <React.Fragment>
                  <Media priority resource={abstructImageBottom} />
                </React.Fragment>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="flex flex-col gap-5">
              <div className='text-white text-shadow shadow-gray-900'>
              {richText && <RichText content={richText} enableGutter={false} />}
              </div>
              {enableLink && link && (
                <div className="w-full mt-4 block md:mt-8">
                  <CMSLink
                    {...link}
                    className="px-12 py-4 h-14 text-lg font-semibold duration-300 ease-in-out"
                    appearance={'default'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
