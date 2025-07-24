import { checkRole } from '@/collections/Users/checkRole'
import type { Access } from 'payload'

const adminsAndOwner: Access = ({ req: { user }, doc }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    // Allow if the user is the creator (owner)
    return {
      createdBy: {
        equals: user?.id,
      },
    }
  }

  return false
}

export default adminsAndOwner
