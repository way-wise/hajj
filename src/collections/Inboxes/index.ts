import type { CollectionConfig } from 'payload'

const Inboxes: CollectionConfig = {
  slug: 'inboxes',
  admin: {
    defaultColumns: ['subject', 'message'],
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default Inboxes
