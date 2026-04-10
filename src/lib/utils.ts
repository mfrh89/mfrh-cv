import type { ProjectData } from './types'

export function asResolvedProjects(projects: Array<ProjectData | number> | null | undefined): ProjectData[] {
  return (projects || []).filter((project): project is ProjectData => typeof project === 'object' && project !== null)
}

export function isShareExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return false
  return Date.parse(expiresAt) < Date.now()
}
