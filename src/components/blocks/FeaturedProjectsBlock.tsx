import { getDraftMode } from '@/lib/draft'
import Link from 'next/link'
import type { PageBlock, ProjectData } from '@/lib/payload'
import { asResolvedProjects, getFeaturedProjects } from '@/lib/payload'
import { ProjectCard } from '@/components/site/ProjectCard'

type FeaturedData = Extract<PageBlock, { blockType: 'featuredProjects' }>

export async function FeaturedProjectsBlock({ block }: { block: FeaturedData }) {
  const draft = await getDraftMode()
  const manualProjects = asResolvedProjects(block.projects)
  const projects: ProjectData[] = manualProjects.length
    ? manualProjects.slice(0, 6)
    : (await getFeaturedProjects({ draft })).slice(0, 6)

  return (
    <section className="page-container py-8 md:py-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          {block.eyebrow && <p className="label-sm">{block.eyebrow}</p>}
          {block.title && <h2 className="mt-4 title-lg">{block.title}</h2>}
          {block.intro && <p className="mt-4 body-lg">{block.intro}</p>}
        </div>
        {block.showAllLink !== false && (
          <Link href="/projects" className="body-md font-500 text-on-surface underline decoration-outline-variant underline-offset-4">
            Alle Projekte ansehen
          </Link>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-10 section-card border-dashed body-lg">
          Noch keine Projekte hinterlegt. Erstelle Eintr&auml;ge in der Collection &quot;Projects&quot; im Payload Admin.
        </div>
      )}
    </section>
  )
}
