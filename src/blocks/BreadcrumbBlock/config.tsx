import type { Block } from 'payload'


export const BreadcrumbBlock: Block = {
    slug: 'breadcrumb',
    interfaceName: 'BreadcrumbBlock',
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
            ],
        },
        {
            name: 'title',
            type: 'text',
            label: 'Title',
        },
        {
            name: 'backgroundImage',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
    ],
};

