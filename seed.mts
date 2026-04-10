import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'

async function seed() {
  const payload = await getPayload({ config })

  const existingUsers = await payload.find({ collection: 'users', limit: 1 })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@mfrh.xyz',
        password: 'changeme123',
      },
    })
    console.log('Admin user created: admin@mfrh.xyz / changeme123')
  } else {
    console.log('Admin user already exists, skipping...')
  }

  const cvPath = path.resolve('content/cv/index.json')
  if (fs.existsSync(cvPath)) {
    const cvData = JSON.parse(fs.readFileSync(cvPath, 'utf-8'))
    await payload.updateGlobal({
      slug: 'cv',
      data: cvData,
    })
    console.log('CV data seeded')
  }

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
