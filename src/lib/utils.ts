import type { CTAData, CTALinkData, ProjectData } from './types'

export function asResolvedProjects(projects: Array<ProjectData | number> | null | undefined): ProjectData[] {
  return (projects || []).filter((project): project is ProjectData => typeof project === 'object' && project !== null)
}

export function resolveCTAHref(cta: CTAData | CTALinkData | null | undefined): string | null {
  if (!cta) return null
  if (cta.linkType === 'internal') {
    const page = cta.page
    if (typeof page === 'object' && page?.slug) {
      return page.slug === 'home' ? '/' : `/${page.slug}`
    }
    return null
  }
  return cta.href || null
}

export function isShareExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false
  return Date.parse(expiresAt) < Date.now()
}
