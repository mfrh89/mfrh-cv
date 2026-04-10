import type { CTAData } from '@/lib/payload'

export function BlockCTA({ cta }: { cta?: CTAData | null }) {
  if (!cta?.label || !cta?.href) return null

  return (
    <a href={cta.href} className={cta.style === 'secondary' ? 'btn-secondary' : 'btn-primary'}>
      {cta.label}
    </a>
  )
}
