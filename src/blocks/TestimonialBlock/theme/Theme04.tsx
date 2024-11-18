/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'
import RichText from '@/components/RichText'


type Props = Extract<Page['layout'][0], { blockType: 'testimonial' }>

export const TestimonialTheme04: React.FC<
    Props & {
        id?: string
    }
> = ({ introContent, testimonials }) => {

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            {/* Title */}
            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                {introContent && <RichText className="team-theme1" content={introContent} enableGutter={false} />}
            </div>
            {/* End Title */}

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    testimonials && (
                        testimonials.map((testimonial, index) => {
                            return (
                                <div className="flex h-auto" key={index}>
                                    <div className="flex flex-col bg-white rounded-xl dark:bg-neutral-900">
                                        <div className="flex-auto p-4 md:p-6">
                                            <p className="text-base italic md:text-lg text-gray-800 dark:text-neutral-200">
                                                {testimonial.quote}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-gray-100 rounded-b-xl md:px-7 dark:bg-neutral-800">
                                            <div className="flex items-center gap-x-3">
                                                <div className="shrink-0">
                                                    {
                                                        testimonial?.image && (
                                                            <img className="size-8 sm:h-[2.875rem] sm:w-[2.875rem] rounded-full" src={(testimonial?.image as Media)?.url || ''} alt="Avatar" />
                                                        )
                                                    }
                                                </div>

                                                <div className="grow">
                                                    <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-neutral-200">
                                                        {testimonial.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                                                        {testimonial.position}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )
                }
            </div>
            {/* End Grid */}
        </div>
    )
}
