import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState, SerializedLexicalNode } from 'lexical'
import type { RichTextContent } from '@/lib/types'

export function InlineRichText({ data, className }: { data: RichTextContent; className?: string }) {
  if (!data) return null
  return (
    <div className={`prose ${className || ''}`}>
      <RichText data={data as SerializedEditorState<SerializedLexicalNode>} />
    </div>
  )
}
