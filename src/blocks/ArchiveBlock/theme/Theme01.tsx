import React, { useEffect, useState } from 'react'

import type { Page, Post } from '@/payload-types'

import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'

type Props = Extract<Page['layout'][0], { blockType: 'archive' }>

export const BlogTheme01: React.FC<
    Props & {
        id?: string
    }
> = ({
  id,
  categories,
  background,
  fixedBackground,
  introContent,
  limit: limitFromProps,
  populateBy,
  selectedDocs,
}) => {
    const limit = limitFromProps || 3

    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        const getPost = async (query) => {
            const postReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts${query}`)

            const fetchedPosts = await postReq.json()
            setPosts(fetchedPosts.docs || [])
        }

        if (populateBy === 'collection') {
            const flattenedCategories = categories?.map((category) => {
                if (typeof category === 'object') return category.id
                else return category
            })

            let query = `?depth=2&limit=${limit}`
            if (flattenedCategories && flattenedCategories.length > 0) {
                query = `&where[categories][in]=${flattenedCategories}`
            }

            getPost(query)
        } else {
            if (selectedDocs?.length) {
                const filteredSelectedPosts = selectedDocs.map((post) => {
                    if (typeof post.value === 'object') return post.value
                }) as Post[]

                setPosts(filteredSelectedPosts || [])
            }
        }
    }, [categories, limit, populateBy, selectedDocs])
    const backgroundImage = background && typeof background === 'object' ? background.url : ''
    const isFixed = fixedBackground ? 'fixed' : 'scroll'

    return (
      <div
      style={{ backgroundImage: `url('${backgroundImage}')`, backgroundAttachment: isFixed }}
      className="bg-no-repeat bg-cover bg-bottom pt-12 md:pt-[60px] pb-12 md:pb-[120px] lg:pb-[720px] relative"
      id={`block-${id}`}>
        {introContent && (
          <div className="container mb-10 md:mb-16 text-white text-shadow shadow-gray-900">
            <RichText className="mx-auto max-w-[48rem]" content={introContent} enableGutter={false} />
          </div>
        )}
        <CollectionArchive posts={posts} />
      </div>

    )
}
