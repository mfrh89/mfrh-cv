export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { CoverLetterDocument } from '@/components/cv/CoverLetterDocument'
import { PrintButton } from '@/components/PrintButton'
import { getCV, getPublishedCoverLetterByToken, isShareExpired } from '@/lib/payload'
import Link from 'next/link'

type Props = {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const { isEnabled: draft } = await draftMode()
  const letter = await getPublishedCoverLetterByToken(token, { draft })

  if (!letter) {
    return {
      title: 'Anschreiben',
    }
  }

  return {
    title: letter.jobTitle || `${letter.company} – Anschreiben`,
    description: `Individuelles Anschreiben für ${letter.company}.`,
  }
}

export default async function CoverLetterTokenPage({ params }: Props) {
  const { token } = await params
  const { isEnabled: draft } = await draftMode()
  const letter = await getPublishedCoverLetterByToken(token, { draft })

  if (!letter) notFound()

  // Bypass share checks if draft mode is enabled
  if (!draft) {
    if (letter.shareDisabled || isShareExpired(letter.shareExpiresAt)) {
      notFound()
    }
  }

  const cv = await getCV({ draft })
  const serverURL = process.env.SERVER_URL || 'http://localhost:3000'

  return (
    <>
      {/* Navigation */}
      <nav className="print-hidden flex items-center justify-center gap-6 bg-white py-3 shadow-sm">
        <Link href="/cv" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          CV
        </Link>
        <Link href={`/cover-letter/${token}`} className="text-xs font-bold text-[var(--color-text)] underline underline-offset-4">
          Anschreiben
        </Link>
      </nav>

      {/* Cover Letter Page */}
      <main className="flex justify-center py-8 print:py-0 overflow-hidden">
        <CoverLetterDocument letter={letter} cv={cv} serverURL={serverURL} />
      </main>

      <PrintButton />
    </>
  )
}
