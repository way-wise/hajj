import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { LandingHero } from '@/heros/Landing'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { Theme01Hero } from '@/heros/Theme01'
import { Theme02Hero } from '@/heros/Theme02'
import { Theme03Hero } from '@/heros/Theme03'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  landing: LandingHero,
  mediumImpact: MediumImpactHero,
  theme01: Theme01Hero,
  theme02: Theme02Hero,
  theme03: Theme03Hero
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null
  {/* @ts-expect-error */}
  return <HeroToRender {...props} />
}
