import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getCV() {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug: 'cv' })
}

