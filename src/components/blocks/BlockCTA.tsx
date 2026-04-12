import type { CTAData } from '@/lib/payload'
import { resolveCTAHref } from '@/lib/utils'

export function BlockCTA({ cta }: { cta?: CTAData | null }) {
  if (!cta?.label) return null

  const href = resolveCTAHref(cta)
  if (!href) return null

  return (
    <a href={href} className={cta.style === 'secondary' ? 'btn-secondary' : 'btn-primary'}>
      {cta.label}
    </a>
  )
}
