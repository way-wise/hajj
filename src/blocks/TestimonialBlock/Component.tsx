import React from 'react'

import type { Page } from '@/payload-types'
import { TestimonialTheme01 } from './theme/Theme01'
import { TestimonialTheme02 } from './theme/Theme02'
import { TestimonialTheme03 } from './theme/Theme03'
import { TestimonialTheme04 } from './theme/Theme04'



const Testimonials = {
    theme01: TestimonialTheme01,
    theme02: TestimonialTheme02,
    theme03: TestimonialTheme03,
    theme04: TestimonialTheme04
}

type Props = Extract<Page['layout'][0], { blockType: 'testimonial' }>

export const TestimonialBlock: React.FC<
    Props & {
        id?: string
    }
> = (props) => {
    const { theme } = props || {}

    if (!theme) return null

    const TestimonialToRender = Testimonials[theme]

    if (!TestimonialToRender) return null

    return <TestimonialToRender {...props} />
}
