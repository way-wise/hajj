'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { Page, User } from '@/payload-types'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
// import { useAuth } from '@payloadcms/ui'
// import { useRouter } from 'next/navigation'

export const PageTemplate: React.FC<{ page: Page | null | undefined }> = ({ page }) => {
  // const router = useRouter()
  // const { user } = useAuth<User>()

  // if(!user){
  //   router.push("/")
  // }

  // if(user && !user?.roles?.includes('admin')){
  //   router.push("/")
  // }

  const { data } = useLivePreview({
    serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
    depth: 5,
    initialData: page,
  })
  if (!data) {
    console.log('page not found')

    return
  }

  const { hero, layout } = data
  return (
    <>
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </>
  )
}
