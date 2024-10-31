import { checkRole } from '@/collections/Users/checkRole'
import { type PayloadHandler } from 'payload'

export const pageHandler: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRole(['admin'], user)) {
    return Response.json({ error: 'Not admin user' }, { status: 401 })
  }

  try {
    const { slug } = req.query

    const result = await payload.find({
      collection: 'pages',
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return Response.json({ success: true, data: result.docs?.[0] || null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)
    return Response.json({ error: message }, { status: 500 })
  }
}
