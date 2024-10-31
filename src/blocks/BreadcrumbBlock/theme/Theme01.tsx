'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import Link from 'next/link'

type Props = Extract<Page['layout'][0], { blockType: 'breadcrumb' }>

interface Media {
    id: string
    url: string
    alt?: string
    updatedAt?: string
    createdAt?: string
}

interface BreadcrumbProps {
    id?: string
    backgroundImage?: string | Media | null
    title: string
}

export const BreadcrumbTheme01: React.FC<BreadcrumbProps> = ({ backgroundImage, title }) => {
    // Check if backgroundImage is a Media object or string and if it has a URL
    const backgroundImageUrl = typeof backgroundImage === 'object' && backgroundImage !== null ? backgroundImage.url : backgroundImage;

    if (backgroundImageUrl) {
        return (
            <div className="relative bg-cover md:h-[400px] h-[200px]" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className="absolute inset-0 bg-black/80"></div>
                <div className="relative z-10 w-full h-full flex justify-center items-center text-white">
                    <div className='flex flex-col gap-8 justify-center items-center'>
                        <h1 className="text-center text-5xl md:text-[80px] md:leading-[100px] font-wedding">{title}</h1>
                        <div className="flex gap-2 items-center text-lg text-white/90">
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <span className="text-primary">{title}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative bg-gray-900 md:h-[400px] h-[200px]">
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="relative z-10 w-full h-full flex justify-center items-center text-white">
                <div className='flex flex-col gap-8 justify-center items-center'>
                    <h1 className="text-center text-5xl md:text-[80px] md:leading-[100px] font-wedding">{title}</h1>
                    <div className="flex gap-2 items-center text-lg text-white/90">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <span className="text-primary">{title}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
