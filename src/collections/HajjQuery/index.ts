import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const HajjQuery: CollectionConfig = {
  slug: 'haj-jquery',
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    components: {
      views: {
        edit: {
          DownloadView: {
            path: '/download',
            Component: '@/collections/HajjQuery/ui/DownloadView',
            tab: {
              label: 'Download',
              href: '/download',
            },
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
      
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    
  ],
}

export default HajjQuery
