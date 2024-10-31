'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CTATheme04: React.FC<
    Props & {
        id?: string
    }
> = ({ links, richText }) => {
    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mx-auto flex max-w-xl flex-col items-center text-center">

                    {richText && <RichText className="cta-theme4" content={richText} enableGutter={false} />}

                    <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
                        {(links || []).map(({ link }, i) => {
                            return <CMSLink key={i} size="lg" {...link} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}