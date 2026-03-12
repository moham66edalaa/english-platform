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
  { href: '/schedule',     label: 'Schedule',        icon: '◷' },
  { href: '/assignments',  label: 'Assignments',    icon: '◈' },
  { href: '/results',      label: 'Results',         icon: '◉' },
  { href: '/attendance',   label: 'Attendance',      icon: '✓' },
  { href: '/test',         label: 'Placement Test', icon: '✎' },
  { href: '/certificates', label: 'Certificates',   icon: '◇' },
  { href: '/profile',      label: 'Profile',         icon: '◎' },
]

const teal  = '#4CC9A8'
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

  const displayName = (user.full_name ?? 'Student').replace(/^Demo\s*/i, '')
  const initials = displayName.slice(0, 2).toUpperCase()
  const isOwner   = user.role === 'owner'
  const isTeacher = user.role === 'teacher'

  return (
    <>
      {/* Responsive styles */}
      <style>{`
        .student-sidebar { display: flex; }
        .student-hamburger { display: none; }
        .student-dropdown { display: none; }
        .student-overlay { display: none; }
        @media (max-width: 768px) {
          .student-sidebar { display: none !important; }
          .student-hamburger { display: flex !important; }
          .student-dropdown { display: block !important; }
          .student-overlay { display: block !important; }
        }
      `}</style>

      {/* ── LEFT SIDEBAR (desktop only) ── */}
      <div className="student-sidebar" style={{
        position: 'fixed', top: 0, left: 0,
        width: '210px', height: '100vh',
        backgroundColor: '#13161f',
        borderRight: '1px solid rgba(245,240,232,0.07)',
        flexDirection: 'column',
        zIndex: 30,
      }}>

        {/* Brand */}
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
          <Link href="/" style={{
            fontFamily: serif, fontSize: '1.45rem', fontWeight: 600,
            color: '#f5f0e8', textDecoration: 'none', display: 'block', lineHeight: 1,
          }}>
            Elo<span style={{ color: teal }}>quence</span>
          </Link>
          {user.cefr_level ? (
            <span style={{
              display: 'inline-block', marginTop: 10, padding: '2px 8px',
              fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: teal, border: '1px solid rgba(76,201,168,0.3)',
              backgroundColor: 'rgba(76,201,168,0.05)', borderRadius: 2,
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
        <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>

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
                color:           active ? teal           : '#8A8278',
                backgroundColor: active ? 'rgba(76,201,168,0.08)' : 'transparent',
                borderLeft:      active ? `2px solid ${teal}` : '2px solid transparent',
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

          {/* Owner/Teacher panel link */}
          {(isOwner || isTeacher) && (
            <>
              <div style={{ height: 1, backgroundColor: 'rgba(245,240,232,0.07)', margin: '12px 10px' }} />
              <p style={{ fontFamily: sans, fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(76,201,168,0.4)', padding: '6px 12px 8px' }}>
                {isOwner ? 'Owner' : 'Teacher'}
              </p>
              <Link href={isOwner ? '/owner' : '/teacher'} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '6px', marginBottom: '2px',
                fontSize: '0.8rem', fontFamily: sans, fontWeight: 500,
                letterSpacing: '0.03em', textDecoration: 'none',
                color: '#8A8278',
                backgroundColor: 'transparent',
                borderLeft: '2px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(76,201,168,0.06)'; e.currentTarget.style.color = teal }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8A8278' }}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>⚙</span>
                {isOwner ? 'Owner Panel' : 'Teacher Panel'}
              </Link>
            </>
          )}
        </div>

        {/* User footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(245,240,232,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg,#307a62,#4CC9A8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#0d0f14', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#f5f0e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </p>
              <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 6,
              fontSize: '0.68rem', fontFamily: sans, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#8A8278', textDecoration: 'none',
              border: '1px solid rgba(245,240,232,0.06)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(76,201,168,0.06)'; e.currentTarget.style.color = teal; e.currentTarget.style.borderColor = 'rgba(76,201,168,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.06)' }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M10 6H2M5 2L1 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Site
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 6,
                fontSize: '0.68rem', fontFamily: sans, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#8A8278', background: 'none', border: '1px solid rgba(245,240,232,0.06)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8A8278'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.06)' }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 1.5H2.5a1 1 0 00-1 1v7a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8 3.5L10.5 6 8 8.5M4.5 6h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── HAMBURGER (mobile only) ── */}
      {open && <div className="student-overlay" onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />}
      <button
        className="student-hamburger"
        onClick={() => setOpen(v => !v)}
        style={{ position: 'fixed', top: 20, right: 24, zIndex: 50, width: 40, height: 40, borderRadius: 4, background: open ? 'rgba(76,201,168,0.12)' : 'rgba(255,255,255,0.04)', border: open ? '1px solid rgba(76,201,168,0.35)' : '1px solid rgba(245,240,232,0.1)', cursor: 'pointer', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}
        aria-label="Navigation menu"
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ display: 'block', width: 16, height: 1.5, backgroundColor: open ? teal : '#d8cebc', borderRadius: 99,
            opacity: i === 1 && open ? 0 : 1,
            transform: i === 0 && open ? 'translateY(3.25px) rotate(45deg)' : i === 2 && open ? 'translateY(-3.25px) rotate(-45deg)' : 'none',
            transition: 'all 0.25s',
          }} />
        ))}
      </button>

      {/* Dropdown (mobile only) */}
      <div className="student-dropdown" style={{ position: 'fixed', top: 68, right: 24, zIndex: 50, width: 200, backgroundColor: '#1a1e28', border: '1px solid rgba(76,201,168,0.2)', borderRadius: 4, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)', pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.2s, transform 0.2s', transformOrigin: 'top right' }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg,#4CC9A8,#80e8cc,#4CC9A8)' }} />
        <div style={{ padding: '6px' }}>
          {NAV.map(({ href, label }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', borderRadius: 3, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', color: active ? teal : '#b8b0a0', backgroundColor: active ? 'rgba(76,201,168,0.08)' : 'transparent', letterSpacing: '0.02em' }}>
                {label}
              </Link>
            )
          })}
          {(isOwner || isTeacher) && (
            <Link href={isOwner ? '/owner' : '/teacher'} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', borderRadius: 3, fontSize: '0.82rem', fontWeight: 500, textDecoration: 'none', color: teal, letterSpacing: '0.02em', borderTop: '1px solid rgba(245,240,232,0.07)', marginTop: 4, paddingTop: 12 }}>
              ⚙ {isOwner ? 'Owner Panel' : 'Teacher Panel'}
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
