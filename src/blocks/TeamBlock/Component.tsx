import React from 'react'

import type { Page } from '@/payload-types'
import { TeamTheme01 } from './theme/Theme01'
import { TeamTheme02 } from './theme/Theme02'
import { TeamTheme03 } from './theme/Theme03'
import { TeamTheme04 } from './theme/Theme04'
import { TeamTheme05 } from './theme/Theme05'


const Teams = {
    theme01: TeamTheme01,
    theme02: TeamTheme02,
    theme03: TeamTheme03,
    theme04: TeamTheme04,
    theme05: TeamTheme05
}

type Props = Extract<Page['layout'][0], { blockType: 'team' }>

export const TeamBlock: React.FC<
    Props & {
        id?: string
    }
> = (props) => {
    const { theme } = props || {}

    if (!theme) return null

    const TeamToRender = Teams[theme]

    if (!TeamToRender) return null

    return <TeamToRender {...props} />
}
