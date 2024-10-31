import { link } from '@/fields/link'
import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const MediaContentSection: Block = {
  slug: 'mediaContentSection',
  interfaceName: 'MediaContentSection',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'contentMedia',
          options: [
            {
              label: 'Content + Media',
              value: 'contentMedia',
            },
            {
              label: 'Media + Content',
              value: 'mediaContent',
            },
          ],
          admin: {
            description: 'Choose how to align the content for this block.',
            width: '50%',
          },
        },
        {
          name: 'mediaHeight',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            AlignFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'enableLink',
      type: 'checkbox',
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, { enableLink }) => enableLink,
        },
      },
    }),
    {
      name: 'contentImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
