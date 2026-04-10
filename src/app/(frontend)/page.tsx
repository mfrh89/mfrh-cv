export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getDraftMode } from '@/lib/draft'
import { notFound } from 'next/navigation'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getPageBySlug, getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const draft = await getDraftMode()
  const page = await getPageBySlug('home', { draft })
  return {
    title: page?.meta?.title || page?.title || 'Home',
    description: page?.meta?.description || 'Portfolio',
  }
}

export default async function HomePage() {
  const draft = await getDraftMode()
  const [page, siteSettings] = await Promise.all([
    getPageBySlug('home', { draft }),
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
