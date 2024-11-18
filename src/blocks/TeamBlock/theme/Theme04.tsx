/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'
import RichText from '@/components/RichText'


type Props = Extract<Page['layout'][0], { blockType: 'team' }>

export const TeamTheme04: React.FC<
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    teams?.map((team, index) => {
                        return (
                            <div key={index} className="flex flex-col rounded-xl p-4 md:p-6 bg-white border border-gray-200 dark:bg-neutral-900 dark:border-neutral-700">
                                <div className="flex items-center gap-x-4">
                                    <img className="rounded-full size-20" src={(team?.image as Media)?.url || ''} alt="Avatar" />
                                    <div className="grow">
                                        <h3 className="font-medium text-gray-800 dark:text-neutral-200">
                                            {team.name}
                                        </h3>
                                        <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">
                                            {team.position}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 text-gray-500 dark:text-neutral-500">
                                    {team.quote}
                                </p>

                                {
                                    team.socialLinks && (
                                        <div className="mt-3 space-x-1">
                                            {team.socialLinks.map((socialLink, index) => {
                                                return (
                                                    <a key={index} className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href={socialLink.link || ''}>
                                                        {
                                                            socialLink.logo && (
                                                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                                                </svg>
                                                            )
                                                        }
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
            {/* End Grid */}
        </div >
    )
}
