/**
 * Creates demo users in Supabase Auth + public.users.
 *
 * Usage:
 *   npx tsx scripts/create-demo-users.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('Get the service role key from: Supabase Dashboard → Settings → API → service_role')
  process.exit(1)
}

// Service role key bypasses RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  { email: 'admin@eloquence.demo',   password: 'demo123456', role: 'admin',   fullName: 'Demo Admin' },
  { email: 'teacher@eloquence.demo', password: 'demo123456', role: 'teacher', fullName: 'Demo Teacher' },
  { email: 'student@eloquence.demo', password: 'demo123456', role: 'student', fullName: 'Demo Student' },
]

async function main() {
  console.log('Service Role Key:', serviceRoleKey!.slice(0, 20) + '...')
  console.log()

  for (const user of DEMO_USERS) {
    console.log(`\n── ${user.role}: ${user.email} ──`)

    // 1. Create or get auth user
    let userId: string | undefined

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.fullName },
    })

    if (error) {
      if (error.message?.includes('already') ) {
        console.log('  Auth: already exists, looking up ID...')
        // Find existing user ID
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const found = users?.find(u => u.email === user.email)
        userId = found?.id
        if (userId) {
          console.log(`  Auth: found (id: ${userId})`)
        } else {
          console.error('  ❌ Could not find auth user!')
          continue
        }
      } else {
        console.error(`  ❌ Auth error: ${error.message}`)
        continue
      }
    } else {
      userId = data.user.id
      console.log(`  Auth: created (id: ${userId})`)
    }

    // 2. Create/update profile in public.users via raw SQL (bypasses RLS)
    const { error: sqlError } = await supabase.rpc('exec_sql' as any, {
      query: `
        INSERT INTO public.users (id, email, full_name, role, is_active)
        VALUES ('${userId}', '${user.email}', '${user.fullName}', '${user.role}', true)
        ON CONFLICT (id) DO UPDATE SET
          role = EXCLUDED.role,
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email;
      `
    })

    if (sqlError) {
      // exec_sql RPC doesn't exist — try direct upsert
      console.log('  Profile: trying direct upsert...')
      const { error: upsertError } = await supabase
        .from('users')
        .upsert(
          { id: userId, email: user.email, role: user.role, full_name: user.fullName, is_active: true } as any,
          { onConflict: 'id' }
        )

      if (upsertError) {
        console.error(`  ❌ Profile error: ${upsertError.message}`)
        console.log('  💡 Try running this SQL in Supabase Dashboard → SQL Editor:')
        console.log(`     INSERT INTO public.users (id, email, full_name, role, is_active)`)
        console.log(`     VALUES ('${userId}', '${user.email}', '${user.fullName}', '${user.role}', true)`)
        console.log(`     ON CONFLICT (id) DO UPDATE SET role='${user.role}', full_name='${user.fullName}';`)
      } else {
        console.log(`  ✅ Profile: role="${user.role}"`)
      }
    } else {
      console.log(`  ✅ Profile: role="${user.role}"`)
    }
  }

  console.log('\n════════════════════════════════')
  console.log('Demo accounts:')
  console.log('  admin@eloquence.demo   / demo123456')
  console.log('  teacher@eloquence.demo / demo123456')
  console.log('  student@eloquence.demo / demo123456')
}

main().catch(console.error)
