import Image from 'next/image'
import type { PageBlock } from '@/lib/payload'
import { getMediaProps, hasRichText } from '@/lib/payload'
import { resolveCTAHref } from '@/lib/utils'
import { BlockCTA } from './BlockCTA'
import { InlineRichText } from './InlineRichText'

type HeroData = Extract<PageBlock, { blockType: 'hero' }>

export function HeroBlock({ block }: { block: HeroData }) {
  const media = getMediaProps(block.media)

  return (
    <section className="relative overflow-hidden">
      <div className="hero-noise" />
      <div className="page-container grid gap-12 py-16 md:py-24">
        <div className="relative z-10 max-w-4xl">
          {block.eyebrow && <p className="label-sm">{block.eyebrow}</p>}
          <h1 className="mt-6 display-lg">{block.headline}</h1>
          {hasRichText(block.intro) && (
            <div className="mt-6 max-w-2xl body-lg">
              <InlineRichText data={block.intro} />
            </div>
          )}

          {(block.cta?.label || block.secondaryCTA?.label) && (
            <div className="mt-8 flex flex-wrap gap-3">
              <BlockCTA cta={block.cta} />
              {block.secondaryCTA?.label && (() => {
                const href = resolveCTAHref(block.secondaryCTA)
                return href ? (
                  <a href={href} className="btn-secondary">
                    {block.secondaryCTA!.label}
                  </a>
                ) : null
              })()}
            </div>
          )}
        </div>

        {media && (
          <div className="relative min-h-[320px] overflow-hidden rounded-[16px] ghost-border shadow-[var(--shadow-float)]">
            <Image
              src={media.src}
              alt={media.alt || block.headline || ''}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
