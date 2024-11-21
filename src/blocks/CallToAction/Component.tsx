import React from 'react'

import type { CallToActionBlock as CallToActionBlockProps } from '@/payload-types'
import { CTATheme01 } from './theme/Theme01'
import { CTATheme02 } from './theme/Theme02'
import { CTATheme03 } from './theme/Theme03'
import { CTATheme04 } from './theme/Theme04'
import { CTATheme05 } from './theme/Theme05'

const CTAs = {
  theme01: CTATheme01,
  theme02: CTATheme02,
  theme03: CTATheme03,
  theme04: CTATheme04,
  theme05: CTATheme05,
}

export const CallToActionBlock: React.FC<
  CallToActionBlockProps & {
    id?: string
  }
> = (props) => {
  const { theme } = props || {}

  if (!theme) return null

  const CTAToRender = CTAs[theme]

  if (!CTAToRender) return null

  return <CTAToRender {...props} />
}
