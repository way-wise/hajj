import { AlignFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, OrderedListFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { number } from 'payload/shared'

export const MapEmbed: Block = {
  slug: 'mapEmbed',
  interfaceName: 'MapEmbed',
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'mapHeight',
      type: 'number',
      min: 1
    },
    {
      name: 'mapCode',
      type: 'text',
      required: true
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
  ],
}
