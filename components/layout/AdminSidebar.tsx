// components/layout/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import React from 'react' // إضافة استيراد React

const NAV = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/courses', label: 'Courses' },
  { href: '/admin/students', label: 'Students' },
  { href: '/admin/assignments', label: 'Assignments' },
  { href: '/admin/placement-test', label: 'Placement Test' },
  { href: '/admin/live-sessions', label: 'Live Sessions' },
  { href: '/admin/analytics', label: 'Analytics' },
]

// تغيير النوع من JSX.Element إلى React.ReactNode
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
}

function AdminSidebarInner() {
  const pathname = usePathname()

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

      {/* Back to site */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(245,240,232,0.07)', flexShrink: 0 }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#6b7280', textDecoration: 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f5f0e8')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M10 6H2M5 2L1 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Site
        </Link>
      </div>
    </div>
  )
}

const AdminSidebar = dynamic(() => Promise.resolve(AdminSidebarInner), {
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