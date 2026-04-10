export const dynamic = 'force-dynamic'

import { getDraftMode } from '@/lib/draft'
import { ProjectCard } from '@/components/site/ProjectCard'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getProjects, getSiteSettings } from '@/lib/payload'

export const metadata = {
  title: 'Projekte',
  description: 'Projektliste mit strukturierten Cards und flexiblen Detailseiten.',
}

export default async function ProjectsPage() {
  const draft = await getDraftMode()
  const [projects, siteSettings] = await Promise.all([getProjects({ draft }), getSiteSettings()])

  return (
    <div className="portfolio-shell">
      <SiteHeader settings={siteSettings} />

      <main className="page-container py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="label-sm">Projekte</p>
          <h1 className="mt-4 display-md">Strukturierte Projektcases statt lose Referenzliste.</h1>
          <p className="mt-6 body-lg">
            Jedes Projekt folgt einem festen Grundaufbau mit Zusammenfassung, Rolle, Kontext und flexiblen Sections.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} priority={index < 2} />
            ))}
          </div>
        ) : (
          <div className="mt-12 section-card border-dashed body-lg">
            Noch keine Projekte hinterlegt. Die Collection Projects ist angelegt und kann im Payload Admin befuellt werden.
          </div>
        )}
      </main>

      <SiteFooter settings={siteSettings} />
    </div>
  )
}
