import { reader } from '@/lib/reader'
import { Header } from '@/components/Header'
import { AboutSection, SkillsSection } from '@/components/cv/Sidebar'
import { ExperienceSection } from '@/components/cv/ExperienceSection'
import { PrintButton } from '@/components/PrintButton'
import { MobileNav } from '@/components/cv/MobileNav'
import Link from 'next/link'

export default async function CVPage() {
  const cv = await reader.singletons.cv.read()

  if (!cv) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">No CV content yet</h1>
          <p className="mb-4 text-gray-500">
            Head to the admin panel to add your CV content.
          </p>
          <a href="/keystatic" className="text-blue-600 underline hover:text-blue-800">
            Open Keystatic Admin &rarr;
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Navigation */}
      <nav className="print-hidden flex items-center justify-center gap-6 bg-white py-3 shadow-sm">
        <Link href="/" className="text-xs font-bold text-[var(--color-text)] underline underline-offset-4">
          CV
        </Link>
        <Link href="/cover-letter" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
          Anschreiben
        </Link>
        <a href="/keystatic" className="ml-4 rounded border border-gray-300 px-3 py-1 text-[10px] text-gray-500 hover:border-gray-500 hover:text-gray-700">
          CMS
        </a>
      </nav>

      {/* CV Page */}
      <main className="flex justify-center py-8 pb-20 md:pb-8 print:py-0">
        <div className="cv-page flex w-full max-w-[260mm] min-h-[297mm] flex-col print:w-[210mm] print:shadow-none">
          {/* ── Full-width Header ── */}
          <Header
            name={cv.name}
            title={cv.title}
            email={cv.email}
            phone={cv.phone}
            linkedin={cv.linkedin}
            profileImage={cv.profileImage}
          />

          {/* ── Mobile: single column ── */}
          <div className="flex flex-col px-4 pb-6 pt-5 md:hidden">
            <AboutSection summary={cv.summary} />
            <div className="mt-5">
              <ExperienceSection experience={cv.experience} />
            </div>
            <div className="mt-5">
              <SkillsSection data={cv} />
            </div>
          </div>

          {/* ── Desktop: two-column body ── */}
          <div className="hidden md:flex flex-1">
            {/* Left Column (sidebar) */}
            <div className="flex w-[36%] shrink-0 flex-col px-6 pb-6 pt-5 space-y-5">
              <AboutSection summary={cv.summary} />
              <SkillsSection data={cv} />
            </div>

            {/* Right Column */}
            <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
              <ExperienceSection experience={cv.experience} />
            </div>
          </div>
        </div>
      </main>

      <PrintButton />
      <MobileNav />
    </>
  )
}
