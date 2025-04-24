import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const Css: CollectionConfig = {
    slug: 'css',
    access: {
        create: authenticated,
        delete: authenticated,
        read: anyone,
        update: authenticated,
    },
    fields: [
        {
            name: 'css',
            type: 'textarea',
            required: false,
        },
    ],
}

export default Css