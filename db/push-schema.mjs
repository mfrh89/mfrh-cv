import { execSync } from 'child_process'
import pg from 'pg'

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })

async function run() {
  try {
    await client.connect()
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    const tables = res.rows.map(row => row.table_name)
    
    if (!tables.includes('pages')) {
      console.log('[init] Essential table "pages" missing. Forcing schema push...')
      // Force Payload to push schema by overriding NODE_ENV to development for this command
      execSync('npx cross-env NODE_ENV=development NODE_OPTIONS=--no-deprecation payload db:push --force', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development' }
      })
      console.log('[init] Schema pushed successfully.')
    } else {
      console.log('[init] Core tables exist.')
    }
  } catch (e) {
    console.error('[init] Error during schema sync:', e.message)
  } finally {
    await client.end()
  }
}

run()
