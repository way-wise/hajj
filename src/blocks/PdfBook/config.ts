import { AlignFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, OrderedListFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const PdfBook: Block = {
  slug: 'pdfBook',
  interfaceName: 'PdfBook',
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
      name: 'width',
      type: 'number',
      min: 1
    },
    {
      name: 'height',
      type: 'number',
      min: 1
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    {
      name: 'introText',
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
