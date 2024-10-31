import { Header } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { Media } from '../Media'

const Logo: React.FC = async () => {
  { /* @ts-expect-error */  }
  const header: Header = await getCachedGlobal('header', 1)();
  const logo = header?.logo;
  return logo && (
      <Media
        resource={logo}
        className="w-48 sm:w-60 md:w-72 lg:80 h-auto dark:brightness-200"
        priority
      />
    )
}

export default Logo
