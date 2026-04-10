import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Re-export types and client-safe utilities for convenience in server components
export type { MediaAsset, CVEntry, CVData, SiteSettingsData, CTAData, PageBlock, PageData, ProjectSection, ProjectData, CoverLetterData } from './types'
export { getMediaProps } from './media'
export { asResolvedProjects, isShareExpired } from './utils'

const getPayloadClient = cache(async () => getPayload({ config: configPromise }))

export const getCV = cache(async (options: { draft?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const data = await (payload as any).findGlobal({
    slug: 'cv',
    depth: 1,
    draft: options.draft,
  })
  return data as import('./types').CVData
})

export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  const data = await (payload as any).findGlobal({ slug: 'site-settings', depth: 1 })
  return data as import('./types').SiteSettingsData
})

export const getPageBySlug = cache(async (slug: string, options: { draft?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const result = await (payload as any).find({
    collection: 'pages',
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
    draft: options.draft,
  })
  return ((result.docs || [])[0] || null) as import('./types').PageData | null
})

export const getProjects = cache(async (options: { draft?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const result = await (payload as any).find({
    collection: 'projects',
    depth: 2,
    limit: 100,
    sort: '-updatedAt',
    draft: options.draft,
  })
  return (result.docs || []) as import('./types').ProjectData[]
})

export const getFeaturedProjects = cache(async (options: { draft?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const result = await (payload as any).find({
    collection: 'projects',
    depth: 2,
    limit: 6,
    sort: '-updatedAt',
    where: { featured: { equals: true } },
    draft: options.draft,
  })
  return (result.docs || []) as import('./types').ProjectData[]
})

export const getProjectBySlug = cache(async (slug: string, options: { draft?: boolean } = {}) => {
  const payload = await getPayloadClient()
  const result = await (payload as any).find({
    collection: 'projects',
    depth: 2,
    limit: 1,
    where: { slug: { equals: slug } },
    draft: options.draft,
  })
  return ((result.docs || [])[0] || null) as import('./types').ProjectData | null
})

export async function getPublishedCoverLetterByToken(token: string, options: { draft?: boolean } = {}): Promise<import('./types').CoverLetterData | null> {
  const payload = await getPayloadClient()
  const result = await (payload as any).find({
    collection: 'cover-letters',
    where: {
      token: { equals: token },
      ...(options.draft ? {} : { _status: { equals: 'published' } }),
    },
    limit: 1,
    draft: options.draft,
  })
  return ((result.docs || [])[0] || null) as import('./types').CoverLetterData | null
}
