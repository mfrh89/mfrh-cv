import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (token !== 'init123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    
    // 1. Create a home page if it doesn't exist
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

    // 2. Create Admin User if none exists
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

    // 3. Seed CV data from JSON
    let cvMsg = 'CV data skipped (file not found).'
    const cvPath = path.resolve('content/cv/index.json')
    if (fs.existsSync(cvPath)) {
      const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf-8'))
      await payload.updateGlobal({
        slug: 'cv',
        data: {
          name: cvData.name,
          title: cvData.title,
          email: cvData.email,
          phone: cvData.phone,
          linkedin: cvData.linkedin,
          summary: cvData.summary,
          skillMaxDots: cvData.skillMaxDots,
          experience: cvData.experience,
          skills: cvData.skills,
          languages: cvData.languages,
          education: cvData.education,
          certificates: cvData.certificates,
          _status: 'published'
        } as any,
      })
      cvMsg = 'CV data seeded.'
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database seeded successfully. ${pageMsg} ${userMsg} ${cvMsg}` 
    })
  } catch (error: any) {
    console.error('[Seed Route Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
