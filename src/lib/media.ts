export type MediaAsset =
  | {
      url?: string | null
      alt?: string | null
      width?: number | null
      height?: number | null
    }
  | string
  | number
  | null
  | undefined

export function getMediaProps(media: MediaAsset, serverURL = process.env.SERVER_URL || 'http://localhost:3000'): { src: string; alt: string } | null {
  if (!media || typeof media !== 'object' || !('url' in media) || !media.url) {
    return null
  }

  const resolved = new URL(media.url, serverURL)
  return {
    src: `${resolved.pathname}${resolved.search}`,
    alt: media.alt || '',
  }
}
