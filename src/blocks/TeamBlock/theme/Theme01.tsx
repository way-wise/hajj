'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'
import RichText from '@/components/RichText'


type Props = Extract<Page['layout'][0], { blockType: 'team' }>

export const TeamTheme01: React.FC<
  Props & {
    id?: string
  }
> = ({ introContent, teams }) => {

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        {introContent && <RichText className="team-theme1" content={introContent} enableGutter={false} />}
      </div>
      {/* End Title */}

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {
          teams?.map((team, index) => {

            const { name, image, position, socialLinks } = team

            return (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4" key={index}>
                {image && typeof image === 'object' && (
                  <img src={(image as Media)?.url || ''} className='size-20 rounded-lg' />
                )}

                <div className="grow">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-neutral-200">
                      {name}
                    </h3>
                    <p className="mt-1 text-xs uppercase text-gray-500 dark:text-neutral-500">
                      {position}
                    </p>
                  </div>

                  {socialLinks && (
                    <div className="mt-2 sm:mt-auto space-x-2.5">
                      {socialLinks.map((socialLink, index) => (
                        socialLink.link && socialLink.logo && (
                          <a
                            key={index}
                            className="inline-flex justify-center items-center text-gray-500 rounded-full hover:text-gray-800 focus:outline-none focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                            href={socialLink.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src={(socialLink?.logo as Media)?.url || ''} alt={`social media ${index + 1}`} />
                          </a>
                        )
                      ))}
                    </div>
                  )}

                </div>
              </div>
            )
          })
        }
      </div>
      {/* End Grid */}
    </div>
  )
}
