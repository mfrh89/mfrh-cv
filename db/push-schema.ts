import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

async function run() {
  console.log('[init] Starting TypeScript-enabled DB Sync...')
  
  try {
    // Set NODE_ENV to development via Object.assign to bypass TS read-only check
    // This is required for Payload to allow the database push logic
    Object.assign(process.env, { NODE_ENV: 'development' });
    
    // getPayload initializes everything and with push: true in config, it syncs the DB
    await getPayload({ config: configPromise })
    console.log('[init] Database sync completed successfully.')
    process.exit(0)
  } catch (error: any) {
    console.error('[init] Database sync failed:', error.message)
    process.exit(1)
  }
}

run()
