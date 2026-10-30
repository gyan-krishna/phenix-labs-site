import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'
import { getOpenJobs } from '@/lib/data/jobs'

/** Canonical public routes exposed to search engines. Admin and API routes are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getOpenJobs()
  const routes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/services'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/products'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/testimonials'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/contact'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/careers'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [
    ...routes,
    ...jobs.map((job) => ({
      url: absoluteUrl(`/careers/${job.jobId}`),
      lastModified: job.opensAt ? new Date(job.opensAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
