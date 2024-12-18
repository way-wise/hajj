/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'
import RichText from '@/components/RichText'


type Props = Extract<Page['layout'][0], { blockType: 'team' }>

export const TeamTheme02: React.FC<
    Props & {
        id?: string
    }
> = ({ introContent, teams }) => {

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            {/* Title */}
            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                {introContent && <RichText className="team-theme1" data={introContent} enableGutter={false} />}
            </div>
            {/* End Title */}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">

                {
                    teams?.map((team, index) => {
                        return (
                            <div className="text-center" key={index}>
                                {
                                    team?.image && (
                                        <img className="rounded-xl sm:size-48 lg:size-60 mx-auto" src={(team?.image as Media)?.url || ''} alt="Avatar" />
                                    )
                                }
                                <div className="mt-2 sm:mt-4">
                                    <h3 className="text-sm font-medium text-gray-800 sm:text-base lg:text-lg dark:text-neutral-200">
                                        {team.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 sm:text-sm lg:text-base dark:text-neutral-400">
                                        {team.position}
                                    </p>
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
