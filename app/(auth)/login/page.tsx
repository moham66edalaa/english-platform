// 📁 app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const DEMO_ACCOUNTS = [
  { role: 'owner',   label: 'Owner',   arabicLabel: 'صاحب المنصة', email: 'owner@eloquence.demo',   password: 'demo123456', color: '#C9A84C', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.25)' },
  { role: 'teacher', label: 'Teacher', arabicLabel: 'مدرس',        email: 'teacher@eloquence.demo', password: 'demo123456', color: '#4CA8C9', bg: 'rgba(76,168,201,0.08)',  border: 'rgba(76,168,201,0.25)' },
  { role: 'student', label: 'Student', arabicLabel: 'طالب',        email: 'student@eloquence.demo', password: 'demo123456', color: '#4CC9A8', bg: 'rgba(76,201,168,0.08)',  border: 'rgba(76,201,168,0.25)' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(loginEmail: string, loginPassword: string) {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })
    if (authError) { setError(authError.message); setLoading(false); return }

    // Redirect based on role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single() as { data: { role: string } | null }

    const role = profile?.role ?? 'student'
    if (role === 'owner') {
      router.push('/owner')
    } else if (role === 'teacher') {
      router.push('/teacher')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await handleLogin(email, password)
  }

  function fillDemo(account: typeof DEMO_ACCOUNTS[0]) {
    setEmail(account.email)
    setPassword(account.password)
    // Auto-submit after brief visual feedback
    setTimeout(() => handleLogin(account.email, account.password), 150)
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
      {/* Ambient gold glow — top */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.11) 0%, transparent 100%)',
      }} />
      {/* Ambient gold glow — bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 30% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 100%)',
      }} />

      {/* Back to homepage */}
      <Link href="/" style={{
        position: 'fixed', top: 24, left: 24, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8,
        color: '#6b7280', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.08em',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#f5f0e8')}
      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M7 3L2 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Home
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[400px] mx-4">

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
            Student Portal
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2.75rem',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#f5f0e8',
          }}>
            Welcome<br />
            <em style={{ fontStyle: 'italic', color: '#c9a84c' }}>back.</em>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.62rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.65)',
                marginBottom: '0.6rem',
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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

          {/* Password field */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,168,76,0.65)',
                }}
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{ fontSize: '0.72rem', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? 'Signing in...' : 'Sign In'}
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

        {/* Demo Accounts Section */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,240,232,0.08)' }} />
            <span style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.25)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.5)', display: 'inline-block' }} />
              Quick Login — Demo Accounts
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(245,240,232,0.08)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                disabled={loading}
                onClick={() => fillDemo(account)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: account.bg,
                  border: `1px solid ${account.border}`,
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = account.color
                    e.currentTarget.style.background = account.bg.replace('0.08', '0.14')
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = account.border
                  e.currentTarget.style.background = account.bg
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: account.color, flexShrink: 0 }}>
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: '0.82rem', color: '#d8cebc', letterSpacing: '0.02em' }}>
                    {account.email}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  color: account.color,
                  border: `1px solid ${account.border}`,
                  backgroundColor: 'transparent',
                }}>
                  {account.arabicLabel}
                </span>
              </button>
            ))}
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.68rem',
            color: 'rgba(245,240,232,0.2)',
            marginTop: '0.75rem',
          }}>
            Click any role to auto-login with demo credentials
          </p>
        </div>

        {/* Footer */}
        <p style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: '#6b7280',
        }}>
          No account yet?{' '}
          <Link
            href="/signup"
            style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8cc80')}
            onMouseLeave={e => (e.currentTarget.style.color = '#c9a84c')}
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
