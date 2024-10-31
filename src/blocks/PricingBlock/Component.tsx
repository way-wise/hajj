import React from 'react'

import type { Page } from '@/payload-types'
import { PricingTheme01 } from './theme/PricingTheme01'
import { PricingTheme02 } from './theme/PricingTheme02'
import { PricingTheme03 } from './theme/PricingTheme03'


const Pricings = {
    theme01: PricingTheme01,
    theme02: PricingTheme02,
    theme03: PricingTheme03
}

type Props = Extract<Page['layout'][0], { blockType: 'pricing' }>

export const PricingBlock: React.FC<
    Props & {
        id?: string
    }
> = (props: any) => {
    const { theme } = props || {}

    if (!theme) return null

    const PricingToRender: any = Pricings[theme]

    if (!PricingToRender) return null

    return <PricingToRender {...props} />
}
