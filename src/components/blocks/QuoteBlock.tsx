import type { PageBlock } from '@/lib/payload'
import { BlockCTA } from './BlockCTA'

type QuoteData = Extract<PageBlock, { blockType: 'quote' }>

export function QuoteBlock({ block }: { block: QuoteData }) {
  return (
    <section className="page-container py-8 md:py-14">
      <div className="section-card">
        <blockquote className="max-w-4xl title-lg leading-[1.3]">
          &ldquo;{block.quote}&rdquo;
        </blockquote>
        {(block.attribution || block.context) && (
          <p className="mt-5 label-sm">
            {[block.attribution, block.context].filter(Boolean).join(' \u2022 ')}
          </p>
        )}
        {block.cta?.label && (
          <div className="mt-6">
            <BlockCTA cta={block.cta} />
          </div>
        )}
      </div>
    </section>
  )
}
