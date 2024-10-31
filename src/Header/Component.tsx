import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

import HeaderTheme01 from './theme/Theme01'
import HeaderTheme02 from './theme/Theme02'

const Headers = {
  theme01: HeaderTheme01,
  theme02: HeaderTheme02
}

export async function Header() {
  { /* @ts-expect-error */ }
  const header: Header = await getCachedGlobal('header', 1)()

  const { theme } = header || {}

  if (!theme) return null

  const HeaderToRender = Headers[theme]

  if (!HeaderToRender) return null

  return <HeaderToRender header={header} />

}
