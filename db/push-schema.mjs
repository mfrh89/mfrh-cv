import pg from 'pg'
import { readFileSync } from 'fs'

const client = new pg.Client({ connectionString: process.env.DATABASE_URI })
await client.connect()

// Always check and apply schema for tables that might be missing
try {
  const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'')
  const tables = res.rows.map(row => row.table_name)
  
  if (!tables.includes('users') || !tables.includes('pages')) {
     console.log('[init] Essential tables missing, applying init.sql schema...')
     const sql = readFileSync('/app/db/init.sql', 'utf-8')
     await client.query(sql)
     console.log('[init] Base schema created successfully')
  } else {
     console.log('[init] Core tables exist, relying on Payload push: true for updates')
  }
} catch (e) {
  console.log('[init] Error checking schema:', e.message)
}

await client.end()
