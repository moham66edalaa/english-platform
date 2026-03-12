/**
 * Fix RLS recursion by running SQL via Supabase's pg_net or direct connection.
 * Uses fetch to the Supabase SQL API endpoint.
 */
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(__dirname, '..', '.env.local')
const env: Record<string, string> = {}
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
  }
}

const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) { console.error('Missing env vars'); process.exit(1) }

const projectRef = url.replace('https://', '').split('.')[0]

const sql = fs.readFileSync(
  path.resolve(__dirname, '..', 'supabase', 'migrations', '003_fix_rls_recursion.sql'),
  'utf-8'
)

async function main() {
  // Try the Supabase database query endpoint (requires service_role or access token)
  // POST https://<project>.supabase.co/rest/v1/rpc/exec_sql won't work
  // But we can try the /pg endpoint available in Supabase

  // Approach: Use supabase-js to call individual SQL via rpc
  // First, let's create a temporary exec_sql function, then use it

  // Step 1: Try direct pg endpoint
  const endpoints = [
    `${url}/pg/query`,
    `${url}/rest/v1/rpc/`,
  ]

  // Actually, the best approach for Supabase Cloud without psql is the
  // Supabase Platform API: https://api.supabase.com/v1/projects/{ref}/database/query
  // But that requires an access token (from supabase login), not service role key.

  // Let's try the Supabase realtime/pg endpoint
  console.log('Attempting to run migration via Supabase API...')

  // Try using the pg-meta endpoint
  const pgMetaUrl = `${url}/pg-meta/default/query`
  const res = await fetch(pgMetaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  if (res.ok) {
    const data = await res.json()
    console.log('Migration completed successfully!')
    console.log(JSON.stringify(data, null, 2))
    return
  }

  console.log(`pg-meta endpoint returned ${res.status}: ${await res.text()}`)

  // Try with X-Connection-Encrypted header
  const res2 = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ query: sql }),
  })

  if (res2.ok) {
    console.log('Migration completed via rpc!')
    return
  }

  console.log(`rpc endpoint returned ${res2.status}: ${await res2.text()}`)
  console.error('\nAutomatic execution failed. Please run the SQL manually:')
  console.error('1. Go to https://supabase.com/dashboard/project/' + projectRef + '/sql')
  console.error('2. Paste the contents of supabase/migrations/003_fix_rls_recursion.sql')
  console.error('3. Click "Run"')
}

main().catch(console.error)
