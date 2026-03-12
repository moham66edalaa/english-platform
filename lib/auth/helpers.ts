// 📁 lib/auth/helpers.ts
// Server-side helpers for getting the current user and checking roles.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRow } from '@/types'

/** Returns the authenticated user's profile row, or redirects to /login. */
export async function requireUser(): Promise<UserRow> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  return profile
}

/** Like requireUser but also enforces owner role. */
export async function requireOwner(): Promise<UserRow> {
  const profile = await requireUser()
  if (profile.role !== 'owner') redirect('/dashboard')
  return profile
}

/** Like requireUser but enforces teacher or owner role. */
export async function requireTeacher(): Promise<UserRow> {
  const profile = await requireUser()
  if (profile.role !== 'teacher' && profile.role !== 'owner') redirect('/dashboard')
  return profile
}

/** Returns user profile or null without redirecting (for optional auth). */
export async function getUser(): Promise<UserRow | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile ?? null
}
