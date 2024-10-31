import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { admins } from '@/access/admins'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'callback',
      type: 'text',
      required: false,
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'subNavItems',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 15,
        },
      ],
      maxRows: 10,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
