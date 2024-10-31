import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { checkRole } from './checkRole'
import { anyone } from '@/access/anyone'
import adminsAndUser from '@/access/adminsAndUser'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
  ],
  timestamps: true,
}

export default Users
