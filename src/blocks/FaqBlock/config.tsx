import type { Block } from 'payload'

import {
    AlignFeature,
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'


export const FaqBlock: Block = {
    slug: 'faq',
    interfaceName: 'FaqBlock',
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
            ],
        },
        {
            name: 'title',
            type: 'text',
            label: 'Title',
        },
        {
            name: 'faqItems',
            label: 'FAQ Items',
            type: 'array',
            minRows: 1,
            maxRows: 10,
            fields: [
                {
                    name: 'question',
                    label: 'Question',
                    type: 'text',
                },
                {
                    name: 'answer',
                    type: 'richText',
                    editor: lexicalEditor({
                        features: ({ rootFeatures }) => {
                            return [
                                ...rootFeatures,
                                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                                AlignFeature(),
                                FixedToolbarFeature(),
                                InlineToolbarFeature()
                            ]
                        },
                    }),
                    label: 'Answer',
                },
            ],
        },
    ],
};

