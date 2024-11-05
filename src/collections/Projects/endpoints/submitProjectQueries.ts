import type { PayloadHandler } from 'payload'

export const submitProjectQueries: PayloadHandler = async (req): Promise<Response> => {
  const { payload, user } = req

  // @ts-expect-error
  const body = await req.json()

  if (!body?.services && !body?.features && !body?.email) {
    return Response.json({ error: 'Answer was not provided appropriately' }, { status: 400 })
  }

  try {
    let currentUser
    if (user) {
      currentUser = user
    } else {
      const findUser = await payload.find({
        collection: 'users',
        depth: 1,
        limit: 1,
        page: 1,
        pagination: false,
        where: {
          email: {
            equals: body?.email
          }
        },
      })
      if(findUser && findUser?.docs.length > 0){
        currentUser = findUser?.docs[0] || {};
      }else{
        currentUser = await payload.create({
          collection: 'users',
          depth: 1,
          data: {
            name: body?.name || 'anonymous',
            email: body?.email,
            password: '12345678',
          },
        })
      }
    }
    const project = await payload.create({
      collection: 'projects',
      depth: 1,
      data: {
        title: body?.title || 'New Project',
        client: currentUser?.id as string,
      },
    })
    if (project) {
      const now = new Date()
      const projectQueries = await payload.create({
        collection: 'project-queries',
        depth: 1,
        data: {
          date: now.toDateString(),
          project: project.id,
          services: body?.services || [],
          features: body?.features || [],
          description: body?.description || '',
          docsLinks: body?.docsLinks || [],
          minPrice: body?.minPrice || 0,
          maxPrice: body?.maxPrice || 0,
        },
      })
      if (projectQueries) {
        return Response.json({
          message: `Project Queries submitted successfully`,
          data: {},
        })
      }
    }
    return Response.json({ error: "Project Queries not submitted" }, { status: 500 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(message)
    return Response.json({ error: message }, { status: 500 })
  }
}
