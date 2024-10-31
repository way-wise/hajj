import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    ParagraphFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { fields } from '@payloadcms/plugin-form-builder';


export const PricingBlock: Block = {
    slug: 'pricing',
    interfaceName: 'PricingBlock',
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
        },
        {
            name: 'priceCards',
            label: 'Price Card',
            type: 'array',
            minRows: 1,
            maxRows: 10,
            fields: [
                {
                    name: 'title',
                    label: 'Title',
                    type: 'text',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                },
                {
                    name: 'highlightText',
                    label: 'Highlight Text',
                    type: 'text'
                },
                {
                    name: 'price',
                    label: "Price",
                    type: 'number'
                },
                {
                    name: 'priceType',
                    label: 'Yearly',
                    type: 'checkbox'
                },
                {
                    name: 'features',
                    label: 'Features',
                    type: 'array',
                    minRows: 1,
                    maxRows: 10,
                    fields: [
                        {
                            name: 'feature',
                            label: 'Feature',
                            type: 'text',
                        }
                    ],
                },
            ],
        },
    ],
};

