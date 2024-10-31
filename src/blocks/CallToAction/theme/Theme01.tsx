'use client'

import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CTATheme01: React.FC<
    Props & {
        id?: string
    }
> = ({ links, richText, backgroundColor }) => {
    return (
        <div className="container">
            <div
                className="rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center"
                style={{ background: `${backgroundColor}` }}
            >
                <div className="max-w-[48rem] flex items-center">
                    {richText && <RichText className="cta-theme1" content={richText} enableGutter={false} />}
                </div>
                <div className="flex flex-col gap-8">
                    {(links || []).map(({ link }, i) => {
                        return <CMSLink key={i} size="lg" {...link} />
                    })}
                </div>
            </div>
        </div>
    )
}