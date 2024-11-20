import React from 'react'

import type { FaqBlock as FaqBlockProps } from '@/payload-types'
import { FaqTheme01 } from './theme/Theme01'
import { FaqTheme02 } from './theme/Theme02'
import { FaqTheme03 } from './theme/Theme03'

const Faqs = {
  theme01: FaqTheme01,
  theme02: FaqTheme02,
  theme03: FaqTheme03,
}

export const FaqBlock: React.FC<
  FaqBlockProps & {
    id?: string
  }
> = (props: any) => {
  const { theme } = props || {}

  if (!theme) return null

  const FaqToRender: any = Faqs[theme]

  if (!FaqToRender) return null

  return <FaqToRender {...props} />
}
