import Image from 'next/image'
import { ProjectSection, getMediaProps, hasRichText } from '@/lib/payload'
import { InlineRichText } from '@/components/blocks/InlineRichText'

export function ProjectSections({ sections }: { sections?: ProjectSection[] | null }) {
  if (!sections?.length) return null

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const key = 'id' in section && section.id ? String(section.id) : `${section.blockType}-${index}`
        if (section.blockType === 'text') {
          return (
            <section key={key} className="section-card">
              {section.eyebrow && <p className="mb-4 label-sm">{section.eyebrow}</p>}
              {section.title && <h2 className="mb-5 title-lg">{section.title}</h2>}
              {hasRichText(section.body) && (
                <InlineRichText data={section.body} className="space-y-4 body-lg" />
              )}
            </section>
          )
        }

        if (section.blockType === 'mediaHighlight') {
          const media = getMediaProps(section.media)
          const mediaFirst = section.layout === 'media-left'
          const textOnly = section.layout === 'text-only' || !media

          return (
            <section key={key} className="section-card">
              <div className={`grid gap-8 ${textOnly ? '' : 'md:grid-cols-2'}`}>
                <div className={mediaFirst ? 'md:order-2' : ''}>
                  {section.eyebrow && <p className="mb-4 label-sm">{section.eyebrow}</p>}
                  {section.title && <h2 className="mb-5 title-lg">{section.title}</h2>}
                  {hasRichText(section.body) && (
                    <InlineRichText data={section.body} className="space-y-4 body-lg" />
                  )}
                </div>
                {!textOnly && media && (
                  <figure className={mediaFirst ? 'md:order-1' : ''}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-surface-low">
                      <Image src={media.src} alt={media.alt || section.title || ''} fill className="object-cover" />
                    </div>
                    {section.caption && <figcaption className="mt-2 body-sm">{section.caption}</figcaption>}
                  </figure>
                )}
              </div>
            </section>
          )
        }

        if (section.blockType === 'stats') {
          return (
            <section key={key} className="section-card-dark">
              {section.title && <h2 className="mb-8 title-lg !text-[var(--on-primary)]">{section.title}</h2>}
              <div className="grid gap-4 md:grid-cols-3">
                {(section.items || []).map((item, i) => (
                  <div key={i} className="rounded-[12px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] p-5">
                    <p className="title-lg !text-[var(--on-primary)]">{item.value}</p>
                    <p className="mt-2 label-sm !text-[rgba(255,255,255,0.6)]">{item.label}</p>
                    {item.detail && <p className="mt-3 body-md !text-[rgba(255,255,255,0.8)]">{item.detail}</p>}
                  </div>
                ))}
              </div>
            </section>
          )
        }

        if (section.blockType === 'quote') {
          return (
            <section key={key} className="section-card">
              {hasRichText(section.quote) && (
                <blockquote className="max-w-4xl title-lg leading-[1.3]">
                  <InlineRichText data={section.quote} />
                </blockquote>
              )}
              {(section.attribution || section.context) && (
                <p className="mt-5 label-sm">
                  {[section.attribution, section.context].filter(Boolean).join(' \u2022 ')}
                </p>
              )}
            </section>
          )
        }

        return null
      })}
    </div>
  )
}
