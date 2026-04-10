import Image from 'next/image'
import { SkillDots } from './SkillDots'
import { getMediaProps } from '@/lib/media'
import type { CVData } from '@/lib/types'

function WebSectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div className="mb-6" id={id}>
      <h2 className="display-sm">{children}</h2>
      <div className="mt-3 h-[2px] w-16 bg-[var(--primary)]" />
    </div>
  )
}

function ContactChip({ icon, href, label }: { icon: React.ReactNode; href?: string; label: string }) {
  const content = (
    <span className="detail-chip gap-2">
      {icon}
      {label}
    </span>
  )
  if (!href) return content
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
      {content}
    </a>
  )
}

export function CVWeb({ cv, serverURL }: { cv: CVData; serverURL: string }) {
  const profileImage = getMediaProps(cv.profileImage, serverURL)
  const logo = getMediaProps(cv.logo, serverURL)

  return (
    <div className="cv-web space-y-8">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="section-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          {profileImage && (
            <div className="shrink-0">
              <Image
                src={profileImage.src}
                alt={cv.name || ''}
                width={96}
                height={96}
                className="rounded-full object-cover h-24 w-24"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-4">
              {logo && (
                <Image
                  src={logo.src}
                  alt="Logo"
                  width={100}
                  height={50}
                  className="h-10 w-auto object-contain opacity-60"
                />
              )}
            </div>
            <h1 className="display-md">{cv.name}</h1>
            {cv.title && <p className="mt-2 title-sm text-[var(--on-surface-variant)]">{cv.title}</p>}
            {cv.summary && <p className="mt-4 body-md max-w-2xl">{cv.summary}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {cv.email && (
            <ContactChip
              href={`mailto:${cv.email}`}
              label={cv.email}
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              }
            />
          )}
          {cv.phone && (
            <ContactChip
              href={`tel:${cv.phone?.replace(/\s+/g, '')}`}
              label={cv.phone}
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              }
            />
          )}
          {cv.location && (
            <ContactChip
              label={cv.location}
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                </svg>
              }
            />
          )}
          {cv.website && (
            <ContactChip
              href={cv.website.startsWith('http') ? cv.website : `https://${cv.website}`}
              label={cv.website}
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.467.732-3.558" />
                </svg>
              }
            />
          )}
          {cv.linkedin && (
            <ContactChip
              href={cv.linkedin.startsWith('http') ? cv.linkedin : `https://${cv.linkedin}`}
              label={cv.linkedin}
              icon={
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.066a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.284" />
                </svg>
              }
            />
          )}
        </div>
      </section>

      {/* ── Experience ───────────────────────────────────── */}
      {(cv.experience?.length || 0) > 0 && (
        <section>
          <WebSectionTitle id="experience">Berufserfahrung</WebSectionTitle>
          <div className="space-y-4">
            {cv.experience!.map((job, i) => (
              <div key={job.id || i} className="section-card">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="title-sm">{job.role}</h3>
                  <span className="label-sm">
                    {job.duration || (job.startDate ? `${job.startDate}${job.endDate ? ` - ${job.endDate}` : ''}` : '')}
                  </span>
                </div>
                {job.company && <p className="mt-1 label-sm !text-[var(--primary)]">{job.company}</p>}
                {job.description && (
                  <ul className="mt-4 space-y-2">
                    {job.description.split('\n').map((point, j) => {
                      const trimmed = point.trim()
                      if (!trimmed) return null
                      return (
                        <li key={j} className="flex gap-3 body-md">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                          <span>{trimmed}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Skills ───────────────────────────────────────── */}
      {(cv.skills?.length || 0) > 0 && (
        <section>
          <WebSectionTitle id="skills">Kompetenzen & Fähigkeiten</WebSectionTitle>

          {cv.languages && cv.languages.length > 0 && (
            <div className="section-card mb-4">
              <h3 className="title-sm mb-4">Sprachen</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {cv.languages.map((lang, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="body-md">{lang.name}</span>
                    <span className="label-sm">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="section-card">
            <h3 className="title-sm mb-4">Tech & Software</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {cv.skills!.map((skill, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span className="body-md">{skill.name}</span>
                  <SkillDots level={skill.level ?? 0} max={cv.skillMaxDots ?? 5} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Education ────────────────────────────────────── */}
      {(cv.education?.length || 0) > 0 && (
        <section>
          <WebSectionTitle id="education">Ausbildung</WebSectionTitle>
          <div className="space-y-4">
            {cv.education!.map((edu, i) => (
              <div key={i} className="section-card">
                <h3 className="title-sm">{edu.degree}</h3>
                <p className="mt-1 body-md">{edu.institution}</p>
                {(edu.startDate || edu.endDate) && (
                  <p className="mt-2 label-sm">
                    {edu.startDate}{edu.endDate ? ` - ${edu.endDate}` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Certificates ─────────────────────────────────── */}
      {(cv.certificates?.length || 0) > 0 && (
        <section>
          <WebSectionTitle id="certificates">Zertifikate</WebSectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {cv.certificates!.map((cert, i) => (
              <div key={i} className="section-card">
                <h3 className="title-sm">{cert.name}</h3>
                <p className="mt-1 body-md">{cert.issuer}</p>
                {(cert.date || cert.status) && (
                  <p className="mt-2 label-sm">
                    {cert.date}{cert.status ? ` (${cert.status})` : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
