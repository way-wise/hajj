'use client'

import React, { useEffect, useState } from 'react'

import RichText from '@/components/RichText'
import type { Category, Page, Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { Link } from 'lucide-react'

type Props = Extract<Page['layout'][0], { blockType: 'archive' }>

export const BlogTheme04: React.FC<
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
                    <RichText className="mx-auto max-w-[48rem]" data={introContent} enableGutter={false} />
                </div>
            )}
            {/* Grid */}

            <div className="grid lg:grid-cols-2 gap-6">
                {posts.length > 0 &&
                    posts.map((post: any, index: number) => {
                        if (typeof post === 'object' && post !== null) {
                            return post?.slug ? (

                                <a className="group relative block rounded-xl focus:outline-none" href={`/posts/${post.slug}`} key={index}>
                                    {post?.meta?.image && (
                                        <div className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
                                            <Media resource={post?.meta?.image} imgClassName="size-full absolute top-0 start-0 object-cover" />
                                        </div>
                                    )}

                                    <div className="absolute top-0 inset-x-0 z-10">
                                        <div className="p-4 flex flex-col h-full sm:p-6">
                                            {/* Avatar */}
                                            <div className="flex items-center">
                                                <div>
                                                    {post?.authors?.length > 0 &&
                                                        post.authors.map((author: any, index: number) => (
                                                            author?.name && (
                                                                <h4 key={index} className="font-semibold text-white">
                                                                    {author.name}
                                                                </h4>
                                                            )
                                                        ))
                                                    }

                                                    <p className="text-xs text-white/80">
                                                        {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* End Avatar */}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 z-10">
                                        <div className="flex flex-col h-full p-4 sm:p-6">
                                            <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
                                                {post?.title}
                                            </h3>
                                            <p className="mt-2 text-white/80">
                                                {post?.meta?.description}
                                            </p>
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
