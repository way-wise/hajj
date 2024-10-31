import { link } from '@/fields/link'
import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const FeatureSection: Block = {
  slug: 'featureSection',
  interfaceName: 'FeatureSection',
  fields: [
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'fixedBackground',
      type: 'checkbox',
      defaultValue: false
    },
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
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            AlignFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
            HorizontalRuleFeature(),
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
      name: 'featureImage1',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'featureImage2',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'abstructImageTop',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'abstructImageBottom',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
  ],
}
