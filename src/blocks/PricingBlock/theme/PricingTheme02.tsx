'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'



type Props = Extract<Page['layout'][0], { blockType: 'pricing' }>

export const PricingTheme02: React.FC<
    Props & {
        id?: string
    }
> = ({ introContent, priceCards }) => {

    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            {/* Title */}
            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                {introContent && <RichText className="pricing-theme2" data={introContent} enableGutter={false} />}
            </div>
            {/* End Title */}

            {/* Grid */}
            <div className="relative before:absolute before:inset-0 before:-z-[1] before:bg-[radial-gradient(closest-side,theme(colors.gray.300),transparent)] dark:before:bg-[radial-gradient(closest-side,theme(colors.neutral.600),transparent)] mt-12">
                <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
                    {
                        priceCards?.map((priceCard, index) => {
                            const { title, description, highlightText, price, priceType, features } = priceCard
                            return (
                                <div key={index} className="flex flex-col h-full text-center">
                                    <div className="bg-white pt-8 pb-5 px-8 dark:bg-neutral-900">
                                        <h4 className="font-medium text-lg text-gray-800 dark:text-neutral-200">{title}</h4>
                                    </div>

                                    <div className="bg-white lg:mt-px lg:py-5 px-8 dark:bg-neutral-900">
                                        <span className="mt-7 font-bold text-5xl text-gray-800 dark:text-neutral-200">
                                            {price} / <span className='text-lg'>{priceType ? 'Year' : 'Month'}</span>
                                        </span>
                                    </div>

                                    <div className="bg-white flex flex-grow justify-center lg:mt-px pt-7 px-8 dark:bg-neutral-900">
                                        <ul className="space-y-2.5 text-center text-sm">
                                            {
                                                features?.map((feature, index) => {
                                                    return (
                                                        <li className="text-gray-800 dark:text-neutral-400" key={index}>
                                                            {feature.feature}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>

                                    <div className="bg-white py-8 px-8 dark:bg-neutral-900">
                                        <a className="py-3 px-4 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-none focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 dark:focus:text-blue-400 dark:focus:border-blue-400" href="#">
                                            Sign up
                                        </a>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {/* End Grid */}
        </div>
    )
}
