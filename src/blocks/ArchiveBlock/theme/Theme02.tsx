'use client'

import React, { useEffect, useState } from 'react'

import RichText from '@/components/RichText'
import type { Page, Post } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'archive' }>

export const BlogTheme02: React.FC<
  Props & {
    id?: string
  }
> = ({ categories, introContent, limit: limitFromProps, populateBy, selectedDocs }) => {
  const limit = limitFromProps || 4

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

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {introContent && (
        <div className="container mb-16">
          <RichText className="mx-auto max-w-[48rem]" content={introContent} enableGutter={false} />
        </div>
      )}
      {/* Grid */}
      <div className="grid lg:grid-cols-2 lg:gap-y-16 gap-10">
        {posts.length > 0 &&
          posts.map((post, index) => {
            if (typeof post === 'object' && post !== null) {
              return post?.slug ? (
                <a
                  className="group block rounded-xl overflow-hidden focus:outline-none"
                  href={`/posts/${post.slug}`}
                  key={index}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    {post?.meta?.image && (
                      <div className="shrink-0 relative rounded-xl overflow-hidden w-full sm:w-56 h-44">
                        <Media
                          resource={post?.meta?.image}
                          imgClassName="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out size-full absolute top-0 start-0 object-cover rounded-xl"
                        />
                      </div>
                    )}
                    <div className="grow">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-neutral-300 dark:group-hover:text-white">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-gray-600 dark:text-neutral-400">
                        {post?.meta?.description}
                      </p>
                      <p className="mt-4 inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 group-hover:underline group-focus:underline font-medium dark:text-blue-500">
                        Read more
                        <svg
                          className="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </p>
                    </div>
                  </div>
                </a>
              ) : null
            }
          })}
      </div>
      {/* End Grid */}
    </div>
  )
}
