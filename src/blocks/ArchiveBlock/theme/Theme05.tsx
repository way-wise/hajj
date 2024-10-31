'use client'

import React, { useEffect, useState } from 'react'

import RichText from '@/components/RichText'
import type { Page, Post } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'archive' }>

export const BlogTheme05: React.FC<
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 lg:mb-14">

                {posts.length > 0 &&
                    posts.map((post, index) => {
                        if (typeof post === 'object' && post !== null) {
                            return post?.slug ? (
                                <a key={index} className="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800" href={`/posts/${post.slug}`}>
                                    {post?.meta?.image && (
                                        <div className="aspect-w-16 aspect-h-9">
                                            <Media resource={post?.meta?.image} imgClassName="w-full object-cover rounded-t-xl" />
                                        </div>
                                    )}
                                    <div className="p-4 md:p-5">
                                        {post?.categories &&
                                            post.categories.map((category: any, index: number) => (
                                                category?.title && (
                                                    <p key={index} className="mt-2 text-xs uppercase text-gray-600 dark:text-neutral-400">
                                                        {category?.title}
                                                    </p>
                                                )
                                            ))
                                        }
                                        <h3 className="mt-2 text-lg font-medium text-gray-800 group-hover:text-blue-600 dark:text-neutral-300 dark:group-hover:text-white">
                                            {post.title}
                                        </h3>
                                    </div>
                                </a>
                            ) : null;
                        }
                    })
                }



            </div>
            {/* End Grid */}
        </div>
    )
}