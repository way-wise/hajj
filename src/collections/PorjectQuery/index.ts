import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const ProjectQuery: CollectionConfig = {
  slug: 'project-query',
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      hasMany:false,
      required: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany:true,
      required: true,
    },
    {
      name: 'features',
      type: 'relationship',
      relationTo: 'features',
      hasMany:true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'docsLinks',
      type: 'array',
      fields: [
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
    {
      name: 'minPrice',
      type: 'number',
    },
    {
      name: 'maxPrice',
      type: 'number',
    },

  ],
}

export default ProjectQuery
