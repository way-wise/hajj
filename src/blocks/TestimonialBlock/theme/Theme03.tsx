'use client'

import React from 'react'

import type { Media, Page } from '@/payload-types'
import RichText from '@/components/RichText'


type Props = Extract<Page['layout'][0], { blockType: 'testimonial' }>

export const TestimonialTheme03: React.FC<
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
            <div className="flex flex-wrap -m-4">
                {
                    testimonials?.map((testimonial, index) => {
                        return (
                            <div className="lg:w-1/3 lg:mb-0 mb-6 p-4" key={index}>
                                <div className="h-full text-center">
                                    {
                                        testimonial.image && (
                                            <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src={(testimonial?.image as Media)?.url || ''} />
                                        )
                                    }
                                    <p className="leading-relaxed">{testimonial.quote}</p>
                                    <span className="inline-block h-1 w-10 rounded bg-indigo-500 mt-6 mb-4"></span>
                                    <h2 className="text-gray-900 font-medium title-font tracking-wider text-sm">{testimonial.name}</h2>
                                    <p className="text-gray-500">{testimonial.position}</p>
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
