'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CTATheme05: React.FC<
    Props & {
        id?: string
    }
> = ({ links, richText, backgroundImage, backgroundColor }) => {
    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-gray-400 p-4 sm:flex-row md:p-8">
                    <div>
                        {richText && <RichText className="cta-theme5" content={richText} enableGutter={false} />}
                    </div>

                    <div className='flex items-center justify-center'>
                        {(links || []).map(({ link }, i) => {
                            return <CMSLink key={i} size="lg" {...link} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}