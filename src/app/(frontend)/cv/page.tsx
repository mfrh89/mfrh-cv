export const dynamic = 'force-dynamic'

import { draftMode } from 'next/headers'
import { CVWeb } from '@/components/cv/CVWeb'
import { PrintButton } from '@/components/PrintButton'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getCV, getSiteSettings } from '@/lib/payload'

export const metadata = {
  title: 'CV',
  description: 'Lebenslauf, vollständig via CMS steuerbar und druckoptimiert.',
}

export default async function CVPage() {
  const { isEnabled: draft } = await draftMode()
  const [cv, siteSettings] = await Promise.all([getCV({ draft }), getSiteSettings()])
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

  return (
    <div className="portfolio-shell">
      <SiteHeader settings={siteSettings} />

      <main className="page-container py-8 pb-20 md:pb-8">
        <div className="mx-auto mb-8 flex w-full max-w-[760px] items-end justify-between gap-4">
          <div>
            <p className="label-sm">Curriculum Vitae</p>
            <p className="mt-2 body-md">Webansicht. Druck-PDF via Button oben rechts.</p>
          </div>
        </div>

        <div className="mx-auto max-w-[760px]">
          <CVWeb cv={cv} serverURL={serverURL} />
        </div>
      </main>

      <SiteFooter settings={siteSettings} />
      <PrintButton />
    </div>
  )
}
