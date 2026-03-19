import { reader } from '@/lib/reader'
import { Header } from '@/components/Header'
import { PrintButton } from '@/components/PrintButton'
import Link from 'next/link'

export default async function CoverLetterPage() {
  const cv = await reader.singletons.cv.read()
  const letter = await reader.singletons.coverLetter.read()

  if (!cv || !letter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">No content yet</h1>
          <p className="mb-4 text-gray-500">
            Add your CV and cover letter content in the admin panel.
          </p>
          <a href="/keystatic" className="text-blue-600 underline hover:text-blue-800">
            Open Keystatic Admin &rarr;
          </a>
        </div>
      </div>
    )
  }

  const paragraphs = letter.body.split('\n\n').filter((p: string) => p.trim())

  return (
    <>
      {/* Navigation */}
      <nav className="print-hidden flex items-center justify-center gap-6 bg-white py-3 shadow-sm">
        <Link href="/" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          CV
        </Link>
        <Link href="/cover-letter" className="text-xs font-bold text-[var(--color-text)] underline underline-offset-4">
          Anschreiben
        </Link>
        <a href="/keystatic" className="ml-4 rounded border border-gray-300 px-3 py-1 text-[10px] text-gray-500 hover:border-gray-500 hover:text-gray-700">
          CMS
        </a>
      </nav>

      {/* Cover Letter Page */}
      <main className="flex justify-center py-8 print:py-0">
        <div className="cover-letter-page flex w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
          {/* ── Full-width Header (same as CV) ── */}
          <Header
            name={cv.name}
            title={cv.title}
            email={cv.email}
            phone={cv.phone}
            linkedin={cv.linkedin}
            profileImage={cv.profileImage}
          />

          {/* Content */}
          <div className="flex-1 px-6 pb-6 pt-5">
            {/* Section Title */}
            <div className="mb-5">
              <h2 className="text-[14px] font-bold tracking-[-0.05em] uppercase text-[var(--color-text)]">
                Anschreiben
              </h2>
              <div className="mt-1 h-px w-full bg-[var(--color-rule)]" />
            </div>

            {/* Salutation */}
            <p className="mb-4 text-[13px] text-[var(--color-text)]">
              {letter.recipientSalutation}
            </p>

            {/* Body */}
            <div className="space-y-3">
              {paragraphs.map((paragraph: string, i: number) => (
                <p
                  key={i}
                  className="text-[12px] leading-[1.6] text-[var(--color-text-muted)]"
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            {/* Closing */}
            <div className="mt-8">
              <p className="text-[13px] text-[var(--color-text)]">
                {letter.closing}
              </p>
              <p className="mt-8 text-[13px] font-bold text-[var(--color-text)]">
                {letter.senderName}
              </p>
            </div>
          </div>
        </div>
      </main>

      <PrintButton />
    </>
  )
}
