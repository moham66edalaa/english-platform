// 📁 app/(auth)/signup/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    })
    if (authError) { setError(authError.message); setLoading(false); return }
    router.push('/test')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '3px',
    padding: '14px 18px',
    color: '#f5f0e8',
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    outline: 'none',
    transition: 'border-color 0.25s, background 0.25s',
    WebkitTextFillColor: '#f5f0e8',
    caretColor: '#c9a84c',
    WebkitBoxShadow: '0 0 0 1000px rgba(26,30,40,0.98) inset',
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0d0f14' }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.11) 0%, transparent 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 30% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 100%)',
      }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[400px] mx-4 py-10">

        {/* Logo */}
        <Link href="/" className="block text-center mb-12">
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.25rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: '#f5f0e8',
          }}>
            Elo<span style={{ color: '#c9a84c' }}>quence</span>
          </span>
        </Link>

        {/* Heading */}
        <div className="mb-9">
          <p style={{
            fontSize: '0.62rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.7)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: '#c9a84c', opacity: 0.7 }} />
            Begin your journey
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.75rem',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#f5f0e8',
          }}>
            Create your<br />
            <em style={{ fontStyle: 'italic', color: '#c9a84c' }}>account.</em>
          </h1>
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.82rem',
            color: '#6b7280',
            lineHeight: 1.65,
          }}>
            Free placement test included — no credit card needed.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" style={{
              display: 'block',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.65)',
              marginBottom: '0.6rem',
            }}>
              Full Name
            </label>
            <input
              id="fullName" type="text" required autoComplete="name"
              value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.06)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.04)'
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.65)',
              marginBottom: '0.6rem',
            }}>
              Email Address
            </label>
            <input
              id="email" type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.06)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.04)'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.65)',
              marginBottom: '0.6rem',
            }}>
              Password
            </label>
            <input
              id="password" type="password" required minLength={8} autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              style={inputStyle}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.06)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                e.currentTarget.style.background   = 'rgba(255,255,255,0.04)'
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontSize: '0.82rem',
              color: '#f87171',
              borderLeft: '2px solid rgba(239,68,68,0.4)',
              paddingLeft: '0.75rem',
              lineHeight: 1.6,
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              position: 'relative',
              width: '100%',
              padding: '15px',
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #c9a84c 0%, #e8cc80 50%, #c9a84c 100%)',
              border: 'none',
              borderRadius: '3px',
              color: '#0d0f14',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              overflow: 'hidden',
              transition: 'opacity 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,240,232,0.08)' }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)' }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,240,232,0.08)' }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => createClient().auth.signInWithOAuth({ provider: 'google' })}
            style={{
              width: '100%',
              padding: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              background: 'transparent',
              border: '1px solid rgba(245,240,232,0.1)',
              borderRadius: '3px',
              color: '#6b7280',
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'
              e.currentTarget.style.background   = 'rgba(201,168,76,0.04)'
              e.currentTarget.style.color         = '#d8cebc'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)'
              e.currentTarget.style.background   = 'transparent'
              e.currentTarget.style.color         = '#6b7280'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#f5f0e8" opacity="0.7" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#f5f0e8" opacity="0.7" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#f5f0e8" opacity="0.7" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#f5f0e8" opacity="0.7" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

        </form>

        {/* Footer */}
        <p style={{
          marginTop: '2.25rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#6b7280',
        }}>
          Already have an account?{' '}
          <Link
            href="/login"
            style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8cc80')}
            onMouseLeave={e => (e.currentTarget.style.color = '#c9a84c')}
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}