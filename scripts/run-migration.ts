/**
 * Run SQL migration 003 against Supabase using the service role key.
 * Uses the Supabase Management API's SQL endpoint.
 *
 * Usage: npx tsx scripts/run-migration.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local
const envPath = path.resolve(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Run each statement separately (can't use BEGIN/COMMIT via REST)
const statements = [
  // 1. Create helper function
  `CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;`,

  // 2. Drop recursive policies
  `DROP POLICY IF EXISTS "owner: read all users" ON public.users;`,
  `DROP POLICY IF EXISTS "users: read own row" ON public.users;`,

  // 3. Recreate non-recursive policies
  `CREATE POLICY "users: read own row" ON public.users FOR SELECT USING (auth.uid() = id);`,
  `CREATE POLICY "owner: read all users" ON public.users FOR SELECT USING (public.get_my_role() = 'owner' OR id = auth.uid());`,

  // 4. Fix other tables
  `DROP POLICY IF EXISTS "courses: owner_teacher all" ON public.courses;`,
  `CREATE POLICY "courses: owner_teacher all" ON public.courses FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "sections: owner_teacher write" ON public.sections;`,
  `CREATE POLICY "sections: owner_teacher write" ON public.sections FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "lessons: owner_teacher write" ON public.lessons;`,
  `CREATE POLICY "lessons: owner_teacher write" ON public.lessons FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "attachments: owner_teacher write" ON public.attachments;`,
  `CREATE POLICY "attachments: owner_teacher write" ON public.attachments FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "quizzes: owner_teacher write" ON public.quizzes;`,
  `CREATE POLICY "quizzes: owner_teacher write" ON public.quizzes FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "questions: owner_teacher write" ON public.quiz_questions;`,
  `CREATE POLICY "questions: owner_teacher write" ON public.quiz_questions FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "pt_questions: owner write" ON public.placement_test_questions;`,
  `CREATE POLICY "pt_questions: owner write" ON public.placement_test_questions FOR ALL USING (public.get_my_role() = 'owner');`,

  `DROP POLICY IF EXISTS "assignments: owner_teacher write" ON public.assignments;`,
  `CREATE POLICY "assignments: owner_teacher write" ON public.assignments FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,

  `DROP POLICY IF EXISTS "live_sessions: owner_teacher write" ON public.live_sessions;`,
  `CREATE POLICY "live_sessions: owner_teacher write" ON public.live_sessions FOR ALL USING (public.get_my_role() IN ('owner', 'teacher'));`,
]

async function main() {
  console.log('Running RLS fix migration...\n')

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ')
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}...  `)

    const { error } = await supabase.rpc('exec_sql', { sql: stmt })

    if (error) {
      // rpc 'exec_sql' may not exist. Try direct fetch to /pg endpoint
      console.log('(rpc failed, trying raw SQL via REST...)')
      break
    }
    console.log('OK')
  }

  // If rpc doesn't work, try the /rest/v1/ approach using raw fetch
  // to the Supabase /pg endpoint (available in newer versions)
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0]

  // Combine all statements
  const fullSql = statements.join('\n')

  const response = await fetch(`${supabaseUrl}/pg/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ query: fullSql }),
  })

  if (response.ok) {
    console.log('\nMigration completed successfully!')
    return
  }

  // Last resort: try Supabase HTTP SQL API
  const response2 = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ sql: fullSql }),
  })

  if (response2.ok) {
    console.log('\nMigration completed successfully!')
    return
  }

  console.error('\nCould not run migration via API.')
  console.error('Please run the SQL manually in your Supabase Dashboard → SQL Editor.')
  console.error('File: supabase/migrations/003_fix_rls_recursion.sql')
}

main().catch(console.error)
