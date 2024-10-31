import React from 'react'
import RichText from '@/components/RichText'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export type Props = Extract<Page['layout'][0], { blockType: 'mediaContentSection' }> & {
  hideBackground?: boolean
}
export const MediaContentSection: React.FC<Props> = (props) => {
  const { link, contentImage, mediaHeight, backgroundImage, richText, alignment, enableLink } =
    props
  const background =
    backgroundImage && typeof backgroundImage === 'object' ? backgroundImage.url : ''
  return (
    <div
      style={{ backgroundImage: `url('${background}')` }}
      className={`bg-no-repeat bg-cover bg-center flex justify-center items-center ${background ? 'py-20' : 'py-8'}`}
    >
      <div className="container px-6 m-auto group">
        <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
          {alignment === 'mediaContent' ? (
            // media-content
            <React.Fragment>
              <div className="col-span-4 lg:col-span-6 h-full flex items-center">
                {contentImage && typeof contentImage === 'object' && (
                  <div
                    className="w-full relative rounded-xl group-hover:shadow-2xl overflow-hidden transition ease-in-out duration-1000"
                    style={{ height: mediaHeight + 'px' }}
                  >
                    <React.Fragment>
                      <Media
                        fill
                        priority
                        resource={contentImage}
                        imgClassName="group-hover:scale-110 object-cover transition ease-in-out"
                      />
                    </React.Fragment>
                  </div>
                )}
              </div>
              <div className="col-span-4 lg:col-span-6 h-full flex items-center">
                {richText && <RichText content={richText} />}
                {enableLink && link && (
                  <div className="w-full mt-4 block md:mt-8">
                    <CMSLink {...link} />
                  </div>
                )}
              </div>
            </React.Fragment>
          ) : (
            // content-media
            <React.Fragment>
              <div className="col-span-4 lg:col-span-6 flex items-center">
                {richText && <RichText content={richText} />}
                {enableLink && link && (
                  <div className="w-full mt-4 block md:mt-8">
                    <CMSLink {...link} />
                  </div>
                )}
              </div>
              <div className="col-span-4 lg:col-span-6 flex items-center">
                {contentImage && typeof contentImage === 'object' && (
                  <div
                    className="w-full relative rounded-xl group-hover:shadow-2xl overflow-hidden transition ease-in-out duration-1000"
                    style={{ height: mediaHeight + 'px' }}
                  >
                    <React.Fragment>
                      <Media
                        fill
                        priority
                        resource={contentImage}
                        imgClassName="group-hover:scale-110 object-cover transition ease-in-out"
                      />
                    </React.Fragment>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}
