import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const Css: GlobalConfig = {
    slug: 'css',
    access: {
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