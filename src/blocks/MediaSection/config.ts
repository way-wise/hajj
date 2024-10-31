import { linkGroup } from '@/fields/linkGroup'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const MediaSection: Block = {
  slug: 'mediaSection',
  interfaceName: 'MediaSection',
  fields: [
    {
      name: 'background',
      type: 'radio',
      defaultValue: 'default',
      required: true,
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Color',
          value: 'color',
        },
        {
          label: 'Gradient',
          value: 'gradient',
        },
        {
          label: 'Image',
          value: 'image',
        },
      ],
    },
    {
      name: 'position',
      type: 'select',
      defaultValue: 'default',
      required: true,
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
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { background }) => background === 'image',
      },
    },
    {
      name: 'bgColor',
      type: 'text',
      admin: {
        condition: (_, { background }) => background === 'color',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startColor',
          type: 'text',
          admin: {
            condition: (_, { background }) => background === 'gradient',
          },
        },
        {
          name: 'endColor',
          type: 'text',
          admin: {
            condition: (_, { background }) => background === 'gradient',
          },
        },
        {
          name: 'angle',
          type: 'number',
          admin: {
            condition: (_, { background }) => background === 'gradient',
          },
        },
      ],
    },
  ],
}
