import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

const ProjectQueries: CollectionConfig = {
  slug: 'project-queries',
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'date',
    hidden: true
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
      required: true,
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
    },
    {
      name: 'features',
      type: 'relationship',
      relationTo: 'features',
      hasMany: true,
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

export default ProjectQueries
