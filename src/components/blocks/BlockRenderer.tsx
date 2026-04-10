import type { PageBlock } from '@/lib/payload'
import { HeroBlock } from './HeroBlock'
import { TextMediaBlock } from './TextMediaBlock'
import { QuoteBlock } from './QuoteBlock'
import { FeaturedProjectsBlock } from './FeaturedProjectsBlock'
import { RichTextBlock } from './RichTextBlock'

export function BlockRenderer({ blocks }: { blocks?: PageBlock[] | null }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const key = 'id' in block && block.id ? String(block.id) : `${block.blockType}-${index}`
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={key} block={block} />
          case 'textMedia':
            return <TextMediaBlock key={key} block={block} />
          case 'quote':
            return <QuoteBlock key={key} block={block} />
          case 'featuredProjects':
            return <FeaturedProjectsBlock key={key} block={block} />
          case 'richText':
            return <RichTextBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
