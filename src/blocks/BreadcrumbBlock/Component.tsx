import React from 'react'

import type { Page } from '@/payload-types'
import { BreadcrumbTheme01 } from './theme/Theme01'


const Breadcrumbs = {
    theme01: BreadcrumbTheme01,
}

type Props = Extract<Page['layout'][0], { blockType: 'breadcrumb' }>

export const BreadcrumbBlock: React.FC<
    Props & {
        id?: string
    }
> = (props: any) => {
    const { theme } = props || {}

    if (!theme) return null

    const BreadcrumbToRender: any = Breadcrumbs[theme]

    if (!BreadcrumbToRender) return null

    return <BreadcrumbToRender {...props} />
}
