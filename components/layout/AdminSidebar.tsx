// components/layout/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import React from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/teachers', label: 'Teachers' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/levels', label: 'Levels' },
  { href: '/admin/groups', label: 'Groups' },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/assignments', label: 'Assignments' },
  { href: '/admin/exams', label: 'Exams & Quizzes' },
  { href: '/admin/attendance', label: 'Attendance' },
  { href: '/admin/live-sessions', label: 'Sessions' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/placement-test', label: 'Placement Test' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
]

const ICONS: Record<string, React.ReactNode> = {
  '/admin': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="11" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  '/admin/courses': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6.5 6.5l5 2.5-5 2.5V6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  '/admin/students': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  '/admin/assignments': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M14 4H4a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  '/admin/placement-test': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  '/admin/live-sessions': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M3 9a6 6 0 006 6M3 9a6 6 0 016-6M15 9a6 6 0 01-6 6M15 9A6 6 0 009 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  '/admin/analytics': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M3 13l4-5 3 3 5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/admin/teachers': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="6.5" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M1 15.5c0-2.761 2.462-5 5.5-5s5.5 2.239 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="13" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M15.5 13.5c0-1.657-1.119-3-2.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  '/admin/groups': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="10" y="1" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="1" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="10" y="10" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  '/admin/levels': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M3 14h4v-3H3v3zM7 14h4V8H7v6zM11 14h4V4h-4v10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  '/admin/exams': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M4 2h10a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 6h6M6 9h6M6 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12.5 11l1 1 2-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/admin/attendance': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M6 2v2M12 2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M5.5 9.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '/admin/payments': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 8h14" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M5 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  '/admin/reports': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M4 14V6M9 14V4M14 14V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  '/admin/settings': (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.697 3.697l1.414 1.414M12.889 12.889l1.414 1.414M3.697 14.303l1.414-1.414M12.889 5.111l1.414-1.414" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
}

function AdminSidebarInner({ user }: { user?: { full_name: string | null; email: string } }) {
  const pathname = usePathname()
  const router = useRouter()
  const displayName = (user?.full_name ?? 'Admin').replace(/^Demo\s*/i, '')
  const initials = displayName.slice(0, 2).toUpperCase()

  async function handleSignOut() {
    await createClient().auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '210px',
      height: '100vh',
      backgroundColor: '#13161f',
      borderRight: '1px solid rgba(245,240,232,0.07)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 30,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(245,240,232,0.07)', flexShrink: 0 }}>
        <Link href="/" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.4rem', fontWeight: 600,
          color: '#f5f0e8', textDecoration: 'none',
          display: 'block', lineHeight: 1,
        }}>
          Elo<span style={{ color: '#c9a84c' }}>quence</span>
        </Link>
        <span style={{
          display: 'inline-block', marginTop: 8, padding: '2px 7px',
          fontSize: '0.57rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)',
          backgroundColor: 'rgba(201,168,76,0.05)', borderRadius: 2,
        }}>
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <div style={{ padding: '8px', flexShrink: 0 }}>
        <p style={{
          fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(107,114,128,0.5)', padding: '8px 8px 6px', margin: 0,
        }}>Menu</p>
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 10px', borderRadius: 3, marginBottom: 2,
                fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.01em',
                textDecoration: 'none',
                color: active ? '#c9a84c' : '#b8b0a0',
                backgroundColor: active ? 'rgba(201,168,76,0.09)' : 'transparent',
                border: active ? '1px solid rgba(201,168,76,0.18)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(245,240,232,0.04)'
                  e.currentTarget.style.color = '#f5f0e8'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#b8b0a0'
                }
              }}
            >
              <span style={{ color: active ? '#c9a84c' : '#6b7280', flexShrink: 0 }}>
                {ICONS[item.href]}
              </span>
              {item.label}
            </Link>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(245,240,232,0.07)', flexShrink: 0 }}>
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
              {displayName}
            </p>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email ?? ''}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 6,
            fontSize: '0.68rem', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#8A8278', textDecoration: 'none',
            border: '1px solid rgba(245,240,232,0.06)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.06)'; e.currentTarget.style.color = '#c9a84c'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)' }}
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
              fontSize: '0.68rem', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase',
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
  )
}

function AdminSidebarWrapper({ user }: { user?: { full_name: string | null; email: string } }) {
  return <AdminSidebarInner user={user} />
}

const AdminSidebar = dynamic(() => Promise.resolve(AdminSidebarWrapper), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '210px', height: '100vh',
      backgroundColor: '#13161f',
      borderRight: '1px solid rgba(245,240,232,0.07)',
      zIndex: 30,
    }} />
  )
})
export default AdminSidebar
