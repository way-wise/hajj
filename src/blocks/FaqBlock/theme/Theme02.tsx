'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'



type Props = Extract<Page['layout'][0], { blockType: 'faq' }>

export const FaqTheme02: React.FC<
    Props & {
        id?: string
    }
> = ({ title, faqItems }) => {

    return (
        <section className='dark:bg-slate-900'>
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                {/* Title */}
                <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                    <h2 className="text-2xl font-bold md:text-3xl md:leading-tight text-gray-800 dark:text-neutral-200">
                        {title}
                    </h2>
                </div>
                {/* End Title */}

                <div className="max-w-5xl mx-auto">
                    {/* Grid */}
                    <div className="grid sm:grid-cols-2 gap-6 md:gap-12">
                        {
                            faqItems?.map((faq, index) => {
                                return (
                                    <div key={index}>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                                            {faq.question}
                                        </h3>
                                        <p className="mt-2 text-gray-600 dark:text-neutral-400">
                                            {faq.answer && <RichText data={faq.answer} enableGutter={false} />}
                                        </p>
                                    </div>
                                )
                            })
                        }
                        {/* End Col */}

                    </div>
                    {/* End Grid */}
                </div>
            </div>
        </section>
    )
}
