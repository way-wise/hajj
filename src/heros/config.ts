import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Landing',
          value: 'landing',
        },
        {
          label: 'theme01',
          value: 'theme01',
        },
        {
          label: 'theme02',
          value: 'theme02',
        },
        {
          label: 'theme03',
          value: 'theme03'
        }
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      label: 'Editor',
      admin: {
        condition: (_, { type } = {}) => ['lowImpact', 'highImpact', 'mediumImpact', 'landing'].includes(type),
      },
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
      required: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'landing'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'backgrounds',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'background',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'subTitle',
      label: 'Sub Title',
      admin: {
        condition: (_, { type } = {}) => ['theme01', 'theme02', 'theme03'].includes(type),
      },
      type: 'text'
    },
    {
      name: 'title',
      label: 'Title',
      admin: {
        condition: (_, { type } = {}) => ['theme01', 'theme02', 'theme03'].includes(type),
      },
      type: 'text'
    },
    {
      name: 'brief',
      label: 'Samll Brief',
      admin: {
        condition: (_, { type } = {}) => ['theme01', 'theme02', 'theme03'].includes(type),
      },
      type: 'textarea'
    }
  ],
  label: false,
}
