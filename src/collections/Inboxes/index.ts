import type { CollectionConfig } from 'payload'
import { checkRole } from '../Users/checkRole'

const Inboxes: CollectionConfig = {
  slug: 'inboxes',
  admin: {
    defaultColumns: ['subject', 'clients', 'projects', 'createdAt'],
    useAsTitle: 'subject',
    hidden: ({ user }) => !checkRole(['admin'], user as any),
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
      name: 'receiver',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      required: false,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default Inboxes
