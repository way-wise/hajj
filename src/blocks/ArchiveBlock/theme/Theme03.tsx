'use client'

import React, { useEffect, useState } from 'react'

import RichText from '@/components/RichText'
import type { Category, Page, Post } from '@/payload-types'
import { Media } from '@/components/Media'

type Props = Extract<Page['layout'][0], { blockType: 'archive' }>

export const BlogTheme03: React.FC<
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



            <div className="max-w-6xl mx-auto py-12 grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                {posts.length > 0 &&
                    posts.map((post, index) => {
                        if (typeof post === 'object' && post !== null) {
                            return post?.slug ? (

                                <a className="group flex flex-col focus:outline-none" href="#" key={index}>
                                    {post?.meta?.image && (
                                        <div className="aspect-w-16 aspect-h-12 overflow-hidden bg-gray-100 rounded-2xl dark:bg-neutral-800">
                                            <Media resource={post?.meta?.image} imgClassName="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" />
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <h3 className="relative inline-block font-medium text-lg text-black before:absolute before:bottom-0.5 before:start-0 before:-z-[1] before:w-full before:h-1 before:bg-lime-400 before:transition before:origin-left before:scale-x-0 group-hover:before:scale-x-100 dark:text-white">
                                            {post?.title}
                                        </h3>
                                        <p className="mt-1 text-gray-600 dark:text-neutral-400">
                                            {post?.meta?.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {post?.categories &&
                                                post.categories.map((category: Category, index: number) => (
                                                    category?.title && (
                                                        <span key={index} className="py-1.5 px-3 bg-white text-gray-600 border border-gray-200 text-xs sm:text-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                                                            {category?.title}
                                                        </span>
                                                    )
                                                ))
                                            }
                                        </div>
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