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
  auth: {
    // cookies: {
    //   secure: true,
    //   sameSite: true,
    //   domain: process.env.NEXT_PUBLIC_SERVER_URL!
    // },
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }: any) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Hello, ${user?.email}!</h1>
              <p>Forget your Password!</p>
              <p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </body>
          </html>
        `
      },
    },
  },
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
