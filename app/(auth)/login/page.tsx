// 📁 app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-sm p-10 relative overflow-hidden">
      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
           style={{ background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)' }} />

      {/* Logo */}
      <Link href="/" className="block text-center mb-8 text-[1.75rem] font-semibold text-[var(--cream)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Elo<span className="text-[var(--gold)]">quence</span>
      </Link>

      <h1 className="text-[1.5rem] font-semibold text-center mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Welcome back
      </h1>
      <p className="text-[0.82rem] text-[var(--muted)] text-center mb-8">
        Sign in to continue learning
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-[0.75rem] tracking-widest uppercase text-[var(--cream-dim)] mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-4 py-3 text-[0.9rem] text-[var(--cream)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[0.75rem] tracking-widest uppercase text-[var(--cream-dim)] mb-2">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-4 py-3 text-[0.9rem] text-[var(--cream)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-400 text-[0.82rem] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-sm px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--gold)] text-[var(--ink)] py-3 rounded-sm text-[0.85rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-[0.82rem] text-[var(--muted)] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[var(--gold)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}