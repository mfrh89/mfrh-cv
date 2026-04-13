import type { PageBlock } from '@/lib/payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'

type RichTextData = Extract<PageBlock, { blockType: 'richText' }>

export function RichTextBlock({ block }: { block: RichTextData }) {
  if (!block.content) return null

  return (
    <section className="page-container py-8 md:py-14">
      <div className="section-card mx-auto max-w-[760px] prose">
        <RichText data={block.content as SerializedEditorState<SerializedLexicalNode>} />
      </div>
    </section>
  )
}
