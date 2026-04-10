import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const disable = searchParams.get('disable')

  if (disable !== null) {
    ;(await draftMode()).disable()
    redirect(slug || '/')
  }

  ;(await draftMode()).enable()
  redirect(slug || '/')
}
