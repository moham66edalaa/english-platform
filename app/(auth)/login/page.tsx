'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.2)] rounded-2xl p-8 shadow-xl w-[400px] min-h-[500px] flex flex-col justify-between">
      <div>
        <Link href="/" className="block text-center mb-6">
          <span className="font-serif text-3xl font-semibold text-[var(--cream)]">
            Elo<span className="text-[var(--gold)]">quence</span>
          </span>
        </Link>

        <h1 className="font-serif text-2xl font-light text-[var(--cream)] mb-2 text-center">
          Welcome back
        </h1>
        <p className="text-[var(--muted)] text-sm text-center mb-6">
          Sign in to continue learning
        </p>

        {/* زيادة المسافة بين الحقول من space-y-4 إلى space-y-6 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-[var(--gold)] mb-1.5">
              Email
            </label>
            {/* زيادة البادنج من py-2.5 إلى py-4 */}
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-md px-5 py-4 text-[var(--cream)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wider text-[var(--gold)] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-md px-5 py-4 text-[var(--cream)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--gold)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[var(--cream-dim)]">
              <input type="checkbox" className="w-4 h-4 accent-[var(--gold)] bg-[var(--ink-3)] border-[rgba(245,240,232,0.2)] rounded" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-[var(--muted)] hover:text-[var(--gold)] transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--gold)] text-[var(--ink)] font-semibold uppercase tracking-widest py-4 rounded-md hover:bg-[var(--gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[rgba(245,240,232,0.1)]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--ink-2)] px-2 text-[var(--muted)]">Or</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              const supabase = createClient()
              supabase.auth.signInWithOAuth({ provider: 'google' })
            }}
            className="w-10 h-10 flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(201,168,76,0.3)] rounded-md hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-colors"
            aria-label="Sign in with Google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--muted)] mt-4">
        Don't have an account?{' '}
        <Link href="/signup" className="text-[var(--gold)] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}