'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post, User } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'publishedAt' | 'authors'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, publishedAt, authors } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`
  const publishedDate = publishedAt ? formatDateTime(publishedAt) : ''
  const author = authors ? ((authors[0] as User).name ?? 'Anonymous') : 'Anonymous'

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark',
        className,
      )}
      ref={card.ref}
    >
      <Link
        className="relative block aspect-[37/22] w-full overflow-hidden"
        href={href}
        ref={link.ref}
      >
        <span className="absolute right-6 top-6 z-20 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold capitalize text-white">
        {showCategories && hasCategories && (
            <div className="uppercase text-sm">
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  if (typeof category === 'object') {
                    const { title: titleFromCategory } = category

                    const categoryTitle = titleFromCategory || 'Untitled category'

                    const isLast = index === categories.length - 1

                    return (
                      <Fragment key={index}>
                        {categoryTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    )
                  }

                  return null
                })}
              </div>
            )}
          </div>
        )}
        </span>
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media
            resource={metaImage}
            fill
            imgClassName="object-cover group-hover:scale-110 object-cover transition ease-in-out"
          />
        )}
      </Link>
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        {titleToUse && (
            <h3>
            <Link
              className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
              href={href}
              ref={link.ref}
            >
                {titleToUse}
              </Link>
            </h3>
        )}
        {description && (
          <div className="mt-2">
            {description && (
              <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium text-body-color dark:border-white dark:border-opacity-10">
                {sanitizedDescription}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center">
          <div className="mr-5 flex items-center border-r border-body-color border-opacity-10 pr-5 dark:border-white dark:border-opacity-10 xl:mr-3 xl:pr-3 2xl:mr-5 2xl:pr-5">
            <div className="w-full">
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">By {author}</h4>
              {/* <p className="text-xs text-body-color">{author.designation}</p> */}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">Date</h4>
            <p className="text-xs text-body-color">{publishedDate}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
