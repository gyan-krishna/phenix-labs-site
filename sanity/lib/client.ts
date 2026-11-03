import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, studioUrl } from '../env'

/** Read client used by server routes and cached data-access modules. */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl,
  },
})

/**
 * Careers availability must reflect an editor's pause, deadline, or status change
 * on the very next request, rather than waiting for the CDN or route cache.
 */
export const sanityFreshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    studioUrl,
  },
})
