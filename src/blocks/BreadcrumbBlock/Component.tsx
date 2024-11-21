import React from 'react'

import type { BreadcrumbBlock as BreadcrumbBlockProps } from '@/payload-types'
import { BreadcrumbTheme01 } from './theme/Theme01'


const Breadcrumbs = {
    theme01: BreadcrumbTheme01,
}

export const BreadcrumbBlock: React.FC<
BreadcrumbBlockProps & {
        id?: string
    }
> = (props: any) => {
    const { theme } = props || {}

    if (!theme) return null

    const BreadcrumbToRender: any = Breadcrumbs[theme]

    if (!BreadcrumbToRender) return null

    return <BreadcrumbToRender {...props} />
}
