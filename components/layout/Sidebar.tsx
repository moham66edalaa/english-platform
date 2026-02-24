// components/layout/Sidebar.tsx
'use client'

import { useState }               from 'react'
import Link                       from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient }           from '@/lib/supabase/client'
import type { UserRow }           from '@/types'

const NAV = [
  { href: '/dashboard',    label: 'Dashboard',      icon: '⊞' },
  { href: '/my-courses',   label: 'My Courses',     icon: '▶' },
  { href: '/test',         label: 'Placement Test', icon: '✎' },
  { href: '/assignments',  label: 'Assignments',    icon: '◈' },
  { href: '/certificates', label: 'Certificates',   icon: '◇' },
]

const gold  = '#C9A84C'
const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"

export default function Sidebar({ user }: { user: UserRow }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await createClient().auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = (user.full_name ?? user.email ?? 'U').slice(0, 2).toUpperCase()
  const isAdmin  = user.role === 'admin'

  return (
    <>
      {/* ── LEFT SIDEBAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '210px', height: '100vh',
        backgroundColor: '#13161f',
        borderRight: '1px solid rgba(245,240,232,0.07)',
        display: 'flex', flexDirection: 'column',
        zIndex: 30,
      }}>

        {/* Brand */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
          <Link href="/" style={{
            fontFamily: serif, fontSize: '1.45rem', fontWeight: 600,
            color: '#f5f0e8', textDecoration: 'none', display: 'block', lineHeight: 1,
          }}>
            Elo<span style={{ color: gold }}>quence</span>
          </Link>
          {user.cefr_level ? (
            <span style={{
              display: 'inline-block', marginTop: 10, padding: '2px 8px',
              fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: gold, border: '1px solid rgba(201,168,76,0.3)',
              backgroundColor: 'rgba(201,168,76,0.05)', borderRadius: 2,
            }}>
              Level {user.cefr_level}
            </span>
          ) : (
            <Link href="/test" style={{
              display: 'inline-block', marginTop: 10, padding: '2px 8px',
              fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#6b7280', border: '1px solid rgba(245,240,232,0.1)', borderRadius: 2,
              textDecoration: 'none',
            }}>
              Take test
            </Link>
          )}
        </div>

        {/* ── NAV LINKS ── */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>

          {/* Student nav */}
          <p style={{ fontFamily: sans, fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.2)', padding: '6px 12px 8px' }}>
            Menu
          </p>
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '6px', marginBottom: '2px',
                fontSize: '0.8rem', fontFamily: sans, fontWeight: 500,
                letterSpacing: '0.03em', textDecoration: 'none',
                color:           active ? gold           : '#8A8278',
                backgroundColor: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                borderLeft:      active ? `2px solid ${gold}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.04)'; e.currentTarget.style.color = '#D4CDB8' }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8A8278' }}}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.7, flexShrink: 0 }}>{icon}</span>
                {label}
              </Link>
            )
          })}

          {/* Admin link — only for admins */}
          {isAdmin && (
            <>
              <div style={{ height: 1, backgroundColor: 'rgba(245,240,232,0.07)', margin: '12px 10px' }} />
              <p style={{ fontFamily: sans, fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', padding: '6px 12px 8px' }}>
                Admin
              </p>
              <Link href="/admin" style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '6px', marginBottom: '2px',
                fontSize: '0.8rem', fontFamily: sans, fontWeight: 500,
                letterSpacing: '0.03em', textDecoration: 'none',
                color: pathname.startsWith('/admin') ? gold : '#8A8278',
                backgroundColor: pathname.startsWith('/admin') ? 'rgba(201,168,76,0.08)' : 'transparent',
                borderLeft: pathname.startsWith('/admin') ? `2px solid ${gold}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = gold }}
              onMouseLeave={e => { if (!pathname.startsWith('/admin')) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8A8278' }}}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>⚙</span>
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(245,240,232,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7a6230,#c9a84c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#0d0f14', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#f5f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.full_name ?? 'Student'}
              </p>
              <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: sans, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f5f0e8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── HAMBURGER (mobile) ── */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />}
      <button
        onClick={() => setOpen(v => !v)}
        style={{ position: 'fixed', top: 20, right: 24, zIndex: 50, width: 40, height: 40, borderRadius: 4, background: open ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)', border: open ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(245,240,232,0.1)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        aria-label="Navigation menu"
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ display: 'block', width: 16, height: 1.5, backgroundColor: open ? gold : '#d8cebc', borderRadius: 99,
            opacity: i === 1 && open ? 0 : 1,
            transform: i === 0 && open ? 'translateY(3.25px) rotate(45deg)' : i === 2 && open ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
            transition: 'all 0.25s',
          }} />
        ))}
      </button>

      {/* Dropdown (mobile) */}
      <div style={{ position: 'fixed', top: 68, right: 24, zIndex: 50, width: 200, backgroundColor: '#1a1e28', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 4, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)', pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.2s, transform 0.2s', transformOrigin: 'top right' }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg,#c9a84c,#e8cc80,#c9a84c)' }} />
        <div style={{ padding: '6px' }}>
          {NAV.map(({ href, label }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', borderRadius: 3, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', color: active ? gold : '#b8b0a0', backgroundColor: active ? 'rgba(201,168,76,0.08)' : 'transparent', letterSpacing: '0.02em' }}>
                {label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', borderRadius: 3, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', color: gold, letterSpacing: '0.02em', borderTop: '1px solid rgba(245,240,232,0.07)', marginTop: 4, paddingTop: 12 }}>
              ⚙ Admin Panel
            </Link>
          )}
        </div>
      </div>
    </>
  )
}