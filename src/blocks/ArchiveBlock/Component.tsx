'use client'

import React from 'react'

import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import { BlogTheme01 } from './theme/Theme01'
import { BlogTheme02 } from './theme/Theme02'
import { BlogTheme03 } from './theme/Theme03'
import { BlogTheme04 } from './theme/Theme04'
import { BlogTheme05 } from './theme/Theme05'

const blogs = {
  theme01: BlogTheme01,
  theme02: BlogTheme02,
  theme03: BlogTheme03,
  theme04: BlogTheme04,
  theme05: BlogTheme05
}

export const ArchiveBlock: React.FC<
ArchiveBlockProps & {
  id?: string
}
> = (props) => {

  const {
    id,
    theme,
    categories,
    background,
    fixedBackground,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props || {}

  if (!theme) return null

  const BlogToRender = blogs[theme]

  if (!BlogToRender) return null

  return <BlogToRender {...props} />
}
