import type { Config } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

interface GetDocArgs {
  collection: Collection
  where?: Record<string, any> // Flexible where clause
  depth?: number
  isOne?: boolean
}

async function getDocument({ collection, where = {}, depth = 0, isOne = false }: GetDocArgs) {
  const payload = await getPayloadHMR({ config: configPromise })

  const query: any = { collection, depth }

  // If a where clause is provided, add it to the query
  if (Object.keys(where).length > 0) {
    query.where = where
  }

  const page = await payload.find(query)

  return isOne ? page.docs[0] : page.docs // return all documents or filtered document(s)
}

/**
 * Returns an unstable_cache function mapped with the cache tag for the collection or where clause
 */

interface Args {
  collection: Collection
  where?: Record<string, any> // Allow passing any filter properties
  cached?: false
  depth?: number
  isOne?: boolean
}

export const getCollections = ({ collection, where = {}, cached, depth, isOne = false }: Args) => {
  if (cached) {
    return unstable_cache(
      async () => getDocument({ collection, where, depth, isOne }),
      [collection, JSON.stringify(where)], // Use where as cache dependency
      {
        tags: [`${collection}_${JSON.stringify(where) || 'all'}`], // Cache tag for specific where clause or all
      },
    )
  } else {
    return async () => getDocument({ collection, where, depth, isOne })
  }
}
