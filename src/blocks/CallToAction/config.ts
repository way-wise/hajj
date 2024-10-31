import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ParagraphFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'theme01',
      options: [
        {
          label: 'Theme01',
          value: 'theme01',
        },
        {
          label: 'Theme02',
          value: 'theme02',
        },
        {
          label: 'Theme03',
          value: 'theme03',
        },
        {
          label: 'Theme04',
          value: 'theme04',
        },
        {
          label: 'Theme05',
          value: 'theme05',
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
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            ParagraphFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Title',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false
    },
    {
      name: 'backgroundColor',
      type: 'text',
      required: false
    }
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
