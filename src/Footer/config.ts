import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { admins } from '@/access/admins'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      name: 'footerLogo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'footerBg',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'textarea',
      name: 'about',
      label: 'Company description',
    },
    {
      name: 'footerNavItems',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          type: 'text',
          name: 'navTitle',
          label: 'Nav Title',
        },
        {
          name: 'navItems',
          type: 'array',
          maxRows: 10,
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      type: 'text',
      name: 'copyright',
      label: 'Copyright',
      defaultValue: 'Copyright 2022 Brand',
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'socialLogo',
          type: 'upload',
          relationTo: 'media',
        },
        link({
          appearances: false,
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
