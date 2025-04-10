import { linkGroup } from '@/fields/linkGroup'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { Banner } from '../Banner/config'
import { SpacerBlock } from '../SpacerBlock/config'
import { CallToAction } from '../CallToAction/config'
import { MediaBlock } from '../MediaBlock/config'
import { HeadingBlock } from '../HeadingBlock/config'
import { ColorPickerField } from '@/fields/colorPicker'

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
      type: 'radio',
      defaultValue: 'box',
      required: true,
      options: [
        {
          label: 'Box',
          value: 'box',
        },
        {
          label: 'Fullscreen',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'backgroundAlign',
      type: 'radio',
      defaultValue: 'center',
      required: true,
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        condition: (_, { background }) => background === 'image',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            BlocksFeature({
              blocks: [Banner, SpacerBlock, CallToAction, MediaBlock, HeadingBlock],
            }),
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
        ...ColorPickerField({
          name: 'startColor',
          required: false,
          admin: {
            condition: (_, { background }) => background === 'gradient',
          },
        }),
        ...ColorPickerField({
          name: 'endColor',
          required: false,
          admin: {
            condition: (_, { background }) => background === 'gradient',
          },
        }),
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
