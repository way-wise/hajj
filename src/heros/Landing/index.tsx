import React from 'react'

import type { Media as MediaType, Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import KenBurnsSlider from '@/components/KenBurnSlider'

export const LandingHero: React.FC<Page['hero']> = ({ links, media, backgrounds, richText }) => {
  let slides: string[] = []
  if (backgrounds && backgrounds.length > 0) {
    backgrounds.map((bg) => {
      const media = bg.background
      slides.push((media as MediaType)?.url as string)
    })
  }

  return (
    <>
      <section
        id="home"
        className="relative z-10 -mt-[7rem] overflow-hidden bg-white dark:bg-black"
      >
        <div className="h-full w-full -z-10">
          <KenBurnsSlider images={slides} timing={7000} zoomEffect={false} />
        </div>
        {/* {backgrounds && typeof optinalMedia === 'object' && (
          <React.Fragment>
            <Media fill imgClassName="-z-10 object-cover brightness-75" priority resource={optinalMedia} />
          </React.Fragment>
        )} */}
        <div className="absolute w-full h-full left-0 top-0 z-10">
        <div className="container h-full px-2.5 py-12">
          <div className="flex justify-center items-center h-full">
            <div className="w-full px-4 py-12">
              <div className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">
                <div className="col-span-4 lg:col-span-7 flex justify-center items-center">
                  <div className='bg-gray-700/60 p-6 backdrop-blur rounded-xl'>
                    <div className="text-gray-50 text-shadow-sm shadow-gray-700">
                      {richText && (
                        <RichText className="mb-6" content={richText} enableGutter={false} />
                      )}
                    </div>
                    {Array.isArray(links) && links.length > 0 && (
                      <ul className="flex gap-4 flex-col md:flex-row">
                        {links.map(({ link }, i) => {
                          return (
                            <li key={i}>
                              <CMSLink
                                className="px-12 py-4 h-14 text-lg font-semibold duration-300 ease-in-out rounded"
                                {...link}
                              />
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="col-span-4 lg:col-span-5 justify-end items-center hidden md:flex">
                  {media && typeof media === 'object' && (
                    <div
                      className="relative w-10/12 translate-y-0"
                      style={{ animation: 'float 6s ease-in-out infinite' }}
                    >
                      <Media imgClassName="rounded-full" priority resource={media} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </>
  )
}
