'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'
import RichText from '@/components/RichText'


type Props = Extract<Page['layout'][0], { blockType: 'team' }>

export const TeamTheme05: React.FC<
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
            <div className="flex flex-wrap -m-4">
                {
                    teams?.map((team, index) => {
                        return (
                            <div className="p-4 lg:w-1/2" key={index}>
                                <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                                    {
                                        team?.image && (
                                            <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src={(team?.image as Media)?.url || ''} />
                                        )
                                    }
                                    <div className="flex-grow sm:pl-8">
                                        <h2 className="title-font font-medium text-lg text-gray-900">{team.name}</h2>
                                        <h3 className="text-gray-500 mb-3">{team.position}</h3>
                                        <p className="mb-4">{team.quote}</p>
                                        <span className="inline-flex items-end">
                                            {
                                                team.socialLinks && (
                                                    team.socialLinks.map((socialLink, index) => {
                                                        return (
                                                            <a className="text-gray-500" href={socialLink.link || ''} key={index}>
                                                                {socialLink.logo && (
                                                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                                                    </svg>
                                                                )
                                                                }
                                                            </a>
                                                        )
                                                    })
                                                )
                                            }
                                        </span>
                                    </div>
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
