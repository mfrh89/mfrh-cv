import Image from 'next/image'
import type { PageBlock } from '@/lib/payload'
import { getMediaProps } from '@/lib/payload'
import { BlockCTA } from './BlockCTA'

type TextMediaData = Extract<PageBlock, { blockType: 'textMedia' }>

function VideoEmbed({ url, aspectRatio }: { url: string; aspectRatio: string }) {
  const style = { aspectRatio }

  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/)
  if (ytMatch) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ytMatch[1]}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-[8px]"
        style={style}
      />
    )
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full rounded-[8px]"
        style={style}
      />
    )
  }

  return (
    <video controls className="h-full w-full rounded-[8px] object-cover" style={style}>
      <source src={url} />
    </video>
  )
}

export function TextMediaBlock({ block }: { block: TextMediaData }) {
  const media = getMediaProps(block.media)
  const hasMedia = block.mediaType !== 'none' && (media || block.videoUrl)
  const mediaFirst = block.layout === 'media-left'
  const aspect = block.aspectRatio || '4/3'

  return (
    <section className="page-container py-8 md:py-14">
      <div className="section-card">
        <div className={`grid gap-8 ${hasMedia ? 'md:grid-cols-2' : ''}`}>
          <div className={mediaFirst ? 'md:order-2' : ''}>
            {block.eyebrow && <p className="mb-4 label-sm">{block.eyebrow}</p>}
            <h2 className="mb-5 title-lg">{block.title}</h2>
            <div className="space-y-4 body-lg">
              {block.body?.split('\n\n').map((p, i) =>
                p.trim() ? <p key={i}>{p.trim()}</p> : null,
              )}
            </div>
            {block.cta?.label && (
              <div className="mt-6">
                <BlockCTA cta={block.cta} />
              </div>
            )}
          </div>

          {hasMedia && (
            <figure className={mediaFirst ? 'md:order-1' : ''}>
              <div
                className="relative overflow-hidden rounded-[8px] bg-surface-low"
                style={{ aspectRatio: aspect }}
              >
                {block.mediaType === 'video' && block.videoUrl ? (
                  <VideoEmbed url={block.videoUrl} aspectRatio={aspect} />
                ) : media ? (
                  <Image src={media.src} alt={media.alt || block.title || ''} fill className="object-cover" />
                ) : null}
              </div>
              {block.caption && <figcaption className="mt-2 body-sm">{block.caption}</figcaption>}
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
