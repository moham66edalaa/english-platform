/**
 * Creates demo users in Supabase Auth.
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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  { email: 'owner@eloquence.demo',   password: 'demo123456', role: 'owner',   fullName: 'Demo Owner' },
  { email: 'teacher@eloquence.demo', password: 'demo123456', role: 'teacher', fullName: 'Demo Teacher' },
  { email: 'student@eloquence.demo', password: 'demo123456', role: 'student', fullName: 'Demo Student' },
]

async function main() {
  for (const user of DEMO_USERS) {
    console.log(`Creating ${user.role}: ${user.email}...`)

    // Create auth user (or skip if exists)
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.fullName },
    })

    if (error) {
      if (error.message?.includes('already been registered') || error.message?.includes('already exists')) {
        console.log(`  ⚡ Already exists, updating role...`)
      } else {
        console.error(`  ❌ Error: ${error.message}`)
        continue
      }
    } else {
      console.log(`  ✅ Created (id: ${data.user.id})`)
    }

    // Update role and full_name in public.users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: user.role, full_name: user.fullName })
      .eq('email', user.email)

    if (updateError) {
      console.error(`  ❌ Role update error: ${updateError.message}`)
    } else {
      console.log(`  ✅ Role set to "${user.role}"`)
    }
  }

  console.log('\nDone! Demo accounts ready:')
  console.log('  owner@eloquence.demo   / demo123456  (صاحب المنصة)')
  console.log('  teacher@eloquence.demo / demo123456  (مدرس)')
  console.log('  student@eloquence.demo / demo123456  (طالب)')
}

main().catch(console.error)
