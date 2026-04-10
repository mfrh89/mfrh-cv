import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ProjectData, getMediaProps } from '@/lib/payload'

export function ProjectCard({ project, priority = false }: { project: ProjectData; priority?: boolean }) {
  const media = getMediaProps(project.coverImage)
  const href = project.slug ? `/projects/${project.slug}` : '/projects'
  const accent = project.accentColor || undefined

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-[16px] bg-surface-lowest ghost-border shadow-[var(--shadow-float)] transition duration-300 hover:-translate-y-1"
      style={accent ? { '--accent': accent } as CSSProperties : undefined}
    >
      <div className="relative h-60 overflow-hidden bg-surface-low ghost-border border-x-0 border-t-0">
        {media ? (
          <Image
            src={media.src}
            alt={media.alt || project.title || 'Projektbild'}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="project-card-fallback h-full w-full">
            <div className="project-card-grid" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6">
              <p className="label-sm">Text-first case study</p>
              <p className="mt-3 max-w-[18rem] title-md">{project.title}</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2 label-sm">
          {project.year && <span>{project.year}</span>}
          {project.client && <span>{project.client}</span>}
          {project.role && <span>{project.role}</span>}
        </div>

        <div>
          <h3 className="title-md">{project.title}</h3>
          {project.excerpt && <p className="mt-3 body-md">{project.excerpt}</p>}
        </div>

        {!!project.tags?.length && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span key={`${tag.label}-${index}`} className="detail-chip">
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
