import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    ParagraphFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'


export const TeamBlock: Block = {
    slug: 'team',
    interfaceName: 'TeamBlock',
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
            name: 'introContent',
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
            label: 'Intro Content',
            required: false
        },
        {
            name: 'teams',
            label: 'Team Member',
            type: 'array',
            minRows: 1,
            maxRows: 16,
            "fields": [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                },
                {
                    name: "position",
                    label: "Position",
                    type: "text",
                },
                {
                    name: "image",
                    label: "Image",
                    type: 'upload',
                    relationTo: 'media',
                    required: false
                },
                {
                    name: "quote",
                    label: "Quote",
                    type: "text"
                },
                {
                    name: 'socialLinks',
                    type: 'array',
                    maxRows: 6,
                    fields: [
                        {
                            name: 'logo',
                            label: 'Social Logo',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'link',
                            label: 'Social Link',
                            type: 'text',
                        },
                        {
                            name: 'openNewTab',
                            label: 'Open In New Tab',
                            type: 'checkbox',
                            defaultValue: true
                        }
                    ],
                },
            ]
        },
    ],
}
