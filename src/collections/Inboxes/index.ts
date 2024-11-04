import type { CollectionConfig } from 'payload'

const Inboxes: CollectionConfig = {
  slug: 'inboxes',
  admin: {
    defaultColumns: ['subject', 'clients', 'projects', 'createdAt'],
    useAsTitle: 'subject',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Set the sender to the current user
        if (req.user) {
          return {
            ...data,
            sender: req.user.id,
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      required: false,
      hasMany: false,
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      required: false,
      hasMany: false,
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}

export default Inboxes
