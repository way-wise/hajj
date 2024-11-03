import type { AccessArgs } from 'payload'

import { User } from '@/payload-types'
import { checkRole } from '@/collections/Users/checkRole'

type isAdmin = (args: AccessArgs<User>) => boolean

export const admins = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}
