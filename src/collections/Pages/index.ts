import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { MediaContentSection } from '@/blocks/MediaContentSection/config'
import { ServiceSection } from '@/blocks/ServiceSection/config'
import { MediaSection } from '@/blocks/MediaSection/config'
import { FeatureSection } from '@/blocks/FeatureSection/config'
import { MapEmbed } from '@/blocks/MapEmbed/config'
import { FaqBlock } from '@/blocks/FaqBlock/config'
import { BreadcrumbBlock } from '@/blocks/BreadcrumbBlock/config'
import { PricingBlock } from '@/blocks/PricingBlock/config'
import { TeamBlock } from '@/blocks/TeamBlock/config'
import { TestimonialBlock } from '@/blocks/TestimonialBlock/config'
import { HeadingBlock } from '@/blocks/HeadingBlock/config'
import { SpacerBlock } from '@/blocks/SpacerBlock/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'content',
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: `/page-preview/${typeof data?.slug === 'string' ? data.slug : ''}`,
          collection: 'pages',
        })

        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                MediaContentSection,
                ServiceSection,
                MediaSection,
                FeatureSection,
                MapEmbed,
                FaqBlock,
                BreadcrumbBlock,
                PricingBlock,
                TeamBlock,
                TestimonialBlock,
                HeadingBlock,
                SpacerBlock,
              ],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
            {
              name: 'keywords',
              type: 'array',
              label: 'Key Words',
              maxRows: 20,
              interfaceName: 'KeyWordsSEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  maxLength: 40
                }
              ]
            }
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: false,
      // autosave: {
      //   interval: 100, // We set this interval for optimal live preview
      // },
    },
    maxPerDoc: 50,
  },
}
