export const dynamic = 'force-dynamic'

import { CVDocument } from '@/components/cv/CVDocument'
import { getCV } from '@/lib/payload'

export const metadata = {
  title: 'CV — Print',
}

export default async function CVPrintPage() {
  const cv = await getCV()
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

  return (
    <div className="portfolio-shell cv-print-shell" style={{ background: '#e3e3e3' }}>
      <CVDocument cv={cv} serverURL={serverURL} />
      <script dangerouslySetInnerHTML={{ __html: 'window.onload=function(){window.print()}' }} />
    </div>
  )
}
