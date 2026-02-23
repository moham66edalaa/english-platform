// 📁 hooks/useUser.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRow } from '@/types'

/**
 * Returns the authenticated user's profile row reactively.
 * Updates automatically when the auth session changes (login / logout).
 */
export function useUser() {
  const [user,    setUser]    = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchProfile(userId: string) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      setUser(data ?? null)
      setLoading(false)
    }

    // Initial load
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) fetchProfile(authUser.id)
      else { setUser(null); setLoading(false) }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) fetchProfile(session.user.id)
        else { setUser(null); setLoading(false) }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}