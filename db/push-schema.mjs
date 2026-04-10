import { execSync } from 'child_process'
import pg from 'pg'

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })

async function run() {
  console.log('[init] Checking database readiness...')
  let retries = 5
  while (retries > 0) {
    try {
      await client.connect()
      console.log('[init] Database is reachable.')
      break
    } catch (e) {
      console.log(\`[init] Database not ready, retrying... (\${retries} left)\`)
      retries--
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  try {
    console.log('[init] Forcing database schema sync via Payload CLI...')
    // We use NODE_ENV=development to ensure Payload triggers the sync logic
    execSync('npx cross-env NODE_ENV=development NODE_OPTIONS=--no-deprecation payload db:push --force', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    })
    console.log('[init] Database sync completed successfully.')
  } catch (e) {
    console.error('[init] Database sync failed, but continuing to start server:', e.message)
  } finally {
    try { await client.end() } catch (e) {}
  }
}

run()
