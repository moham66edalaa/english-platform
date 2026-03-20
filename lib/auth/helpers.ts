// 📁 lib/auth/helpers.ts
// Server-side helpers for getting the current user and checking roles.

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRow } from '@/types'

/**
 * Fetches the user profile, or creates it via ensure_user_profile() RPC
 * if the row is missing (e.g. trigger didn't fire on signup).
 */
async function fetchOrCreateProfile(supabase: Awaited<ReturnType<typeof createClient>>, authUser: { id: string; email?: string; user_metadata?: Record<string, any> }): Promise<UserRow | null> {
  // Try direct read first
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (profile) return profile

  // Profile missing — try the ensure_user_profile() RPC (SECURITY DEFINER, bypasses RLS)
  const { data: rpcProfile } = await supabase.rpc('ensure_user_profile')
  if (rpcProfile) return rpcProfile as unknown as UserRow

  // RPC not available (migration not applied yet) — return in-memory fallback
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: authUser.user_metadata?.full_name ?? null,
    avatar_url: null,
    role: 'student',
    cefr_level: null,
    level_id: null,
    phone: null,
    parent_name: null,
    bio: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as UserRow
}

/** Returns the authenticated user's profile row, or redirects to /login. */
export async function requireUser(): Promise<UserRow> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await fetchOrCreateProfile(supabase, user)
  if (!profile) redirect('/login')

  return profile
}

/** Like requireUser but also enforces admin role. */
export async function requireAdmin(): Promise<UserRow> {
  const profile = await requireUser()
  if (profile.role !== 'admin') redirect('/dashboard')
  return profile
}

/** Like requireUser but enforces teacher or admin role. */
export async function requireTeacher(): Promise<UserRow> {
  const profile = await requireUser()
  if (profile.role !== 'teacher' && profile.role !== 'admin') redirect('/dashboard')
  return profile
}

/** Returns user profile or null without redirecting (for optional auth). */
export async function getUser(): Promise<UserRow | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  return fetchOrCreateProfile(supabase, user)
}
