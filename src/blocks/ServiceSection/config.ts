import { link } from '@/fields/link'
import {
  AlignFeature,
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { SpacerBlock } from '../SpacerBlock/config'
import { HeadingBlock } from '../HeadingBlock/config'

export const ServiceSection: Block = {
  slug: 'serviceSection',
  interfaceName: 'ServiceSection',
  fields: [
    {
      name: 'intro',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            AlignFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            BlocksFeature({
              blocks: [SpacerBlock, HeadingBlock],
            }),
          ]
        },
      }),
      label: false,
    },
    {
      name: 'column',
      type: 'number',
      required: true,
      defaultValue: 3,
      min: 1,
      max: 6
    },
    {
      name: 'fixedBackground',
      type: 'checkbox',
      defaultValue: false
    },
    {
      name: 'services',
      type: 'array',
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
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5'] }),
                AlignFeature(),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                BlocksFeature({
                  blocks: [SpacerBlock, HeadingBlock],
                }),
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
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
