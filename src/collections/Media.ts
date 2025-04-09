import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
// import { fileURLToPath } from 'url'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { checkRole } from './Users/checkRole'

// const filename = fileURLToPath(import.meta.url)
// const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: anyone,
  },
  admin: {
    group: 'content',
    hidden: ({ user }) => !checkRole(['admin'], user as any),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      defaultValue: 'image alt',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    // staticDir: path.resolve(dirname, '../../public/media'),
    staticDir: path.join(process.cwd(), 'public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    displayPreview: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
    ],
  },
}
