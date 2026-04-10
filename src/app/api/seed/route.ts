import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== 'init123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    const existingPages = await (payload as any).find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    let pageMsg = 'Home page already exists.'
    if (existingPages.totalDocs === 0) {
      await (payload as any).create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          layout: [
            {
              blockType: 'hero',
              headline: 'Willkommen',
              intro: 'Die modulare Startseite ist erfolgreich eingerichtet.',
            }
          ],
          _status: 'published'
        },
      })
      pageMsg = 'Home page created.'
    }

    const existingUsers = await (payload as any).find({ collection: 'users' })
    let userMsg = 'Admin user already exists.'
    if (existingUsers.totalDocs === 0) {
      await (payload as any).create({
        collection: 'users',
        data: {
          email: 'admin@mfrh.xyz',
          password: 'changeme123',
        },
      })
      userMsg = 'Admin user created (admin@mfrh.xyz / changeme123).'
    }

    return NextResponse.json({ success: true, message: `Database seeded successfully. ${pageMsg} ${userMsg}` })
  } catch (error: any) {
    console.error('[Seed Route Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
