import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { checkRole } from '../Users/checkRole'

const Features: CollectionConfig = {
    slug: 'features',
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    admin: {
        useAsTitle: 'name',
        hidden: ({ user }) => !checkRole(['admin'], user as any),
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: false,
        },
        {
            name: 'service',
            type: 'relationship',
            relationTo: 'services',
            admin: {
                position: 'sidebar',
            },
            hasMany: true,
            required: false,
        },
        {
            name: 'minPrice',
            type: 'number',
            required: true,
        },
        {
            name: 'maxPrice',
            type: 'number',
            required: true,
        },
        {
            name: 'isActive',
            label: 'Is Active',
            type: 'checkbox',
            defaultValue: true
        },
    ],
}

export default Features
