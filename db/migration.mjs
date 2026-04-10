import pg from 'pg'

const DATABASE_URI = process.env.DATABASE_URI

async function run() {
  if (!DATABASE_URI) {
    console.error('[migration] No DATABASE_URI found.')
    process.exit(1)
  }

  const client = new pg.Client({ connectionString: DATABASE_URI })
  
  try {
    await client.connect()
    console.log('[migration] Connected to database. Ensuring schema is up to date...')

    // 1. Create essential tables if they don't exist
    await client.query(\`
      CREATE TABLE IF NOT EXISTS "pages" (
        "id" serial PRIMARY KEY,
        "title" varchar,
        "slug" varchar UNIQUE,
        "layout" jsonb,
        "meta" jsonb,
        "updated_at" timestamp with time zone DEFAULT now(),
        "created_at" timestamp with time zone DEFAULT now(),
        "_status" varchar DEFAULT 'draft'
      );

      CREATE TABLE IF NOT EXISTS "projects" (
        "id" serial PRIMARY KEY,
        "title" varchar,
        "slug" varchar UNIQUE,
        "updated_at" timestamp with time zone DEFAULT now(),
        "created_at" timestamp with time zone DEFAULT now(),
        "_status" varchar DEFAULT 'draft'
      );

      CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
        "id" serial PRIMARY KEY,
        "global_slug" varchar,
        "updated_at" timestamp with time zone DEFAULT now(),
        "created_at" timestamp with time zone DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
        "id" serial PRIMARY KEY,
        "order" integer,
        "parent_id" integer NOT NULL REFERENCES "payload_locked_documents"("id") ON DELETE CASCADE,
        "path" varchar NOT NULL,
        "pages_id" integer,
        "projects_id" integer,
        "users_id" integer
      );
    \`)

    // 2. Ensure missing columns exist (for robustness)
    const columnsToEnsure = [
      { table: 'pages', column: '_status', type: 'varchar DEFAULT \'draft\'' },
      { table: 'projects', column: '_status', type: 'varchar DEFAULT \'draft\'' },
      { table: 'payload_locked_documents_rels', column: 'pages_id', type: 'integer' },
      { table: 'payload_locked_documents_rels', column: 'projects_id', type: 'integer' }
    ]

    for (const col of columnsToEnsure) {
      try {
        await client.query(\`ALTER TABLE "\${col.table}" ADD COLUMN "\${col.column}" \${col.type}\`)
        console.log(\`[migration] Added column \${col.column} to table \${col.table}.\`)
      } catch (e) {
        // Ignore "already exists" errors
      }
    }

    console.log('[migration] Database structure is ready.')
  } catch (err) {
    console.error('[migration] Critical error during database sync:', err.message)
    // We don't exit with 1 here to allow the server to try and start anyway
  } finally {
    await client.end()
  }
}

run()
