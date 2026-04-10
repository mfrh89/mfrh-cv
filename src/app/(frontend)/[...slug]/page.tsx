export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getDraftMode } from '@/lib/draft'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getPageBySlug, getSiteSettings } from '@/lib/payload'

type Props = {
  params: Promise<{ slug: string[] }>
}

function resolveSlug(segments: string[]): string {
  return segments.join('/')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const draft = await getDraftMode()
  const page = await getPageBySlug(resolveSlug(slug), { draft })

  if (!page) {
    return { title: 'Seite nicht gefunden' }
  }

  return {
    title: page.meta?.title || page.title || 'Page',
    description: page.meta?.description || undefined,
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const resolvedSlug = resolveSlug(slug)
  const draft = await getDraftMode()

  const [page, siteSettings] = await Promise.all([
    getPageBySlug(resolvedSlug, { draft }),
    getSiteSettings(),
  ])

  if (!page) {
    notFound()
  }

  return (
    <div className="portfolio-shell">
      <SiteHeader settings={siteSettings} />
      <main>
        <BlockRenderer blocks={page.layout} />
      </main>
      <SiteFooter settings={siteSettings} />
    </div>
  )
}
