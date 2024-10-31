import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import FooterTheme01 from './theme/Theme01'
import FooterTheme02 from './theme/Theme02'

const Footers = {
  theme01: FooterTheme01,
  theme02: FooterTheme02
}

export async function Footer() {
  // const footer: Footer = await getCachedGlobal('footer', 1)()

  // return <FooterClient footer={footer} />

  const footer: Footer = await getCachedGlobal('footer', 1)()

  const { theme } = footer || {}

  if (!theme) return null

  const FooterToRender = Footers[theme]

  if (!FooterToRender) return null

  return <FooterToRender footer={footer} />
}
