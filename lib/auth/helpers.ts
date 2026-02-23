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

/** Like requireUser but also enforces admin role. */
export async function requireAdmin(): Promise<UserRow> {
  const profile = await requireUser()
  if (profile.role !== 'admin') redirect('/dashboard')
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