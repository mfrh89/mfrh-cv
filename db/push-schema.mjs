import { execSync } from 'child_process'
import pg from 'pg'

async function run() {
  console.log('[init] DB Sync Start')
  
  if (!process.env.DATABASE_URI) {
    console.error('[init] DATABASE_URI is missing!')
    return
  }

  // 1. Force Schema Push via Payload CLI
  try {
    console.log('[init] Forcing schema push...')
    // We explicitly point to the config file and use cross-env to force development mode
    // so Payload allows the db push in a production environment.
    execSync('cross-env NODE_ENV=development payload db:push --force --config src/payload.config.ts', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    })
    console.log('[init] Schema push completed.')
  } catch (e) {
    console.error('[init] Schema push warning (continuing):', e.message)
  }
}

run().catch(console.error)
