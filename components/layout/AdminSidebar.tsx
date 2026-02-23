// 📁 components/layout/AdminSidebar.tsx
'use client'

import Link           from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',                 label: 'Overview',         icon: '⊞', exact: true },
  { href: '/admin/courses',         label: 'Courses',          icon: '▶' },
  { href: '/admin/students',        label: 'Students',         icon: '◎' },
  { href: '/admin/assignments',     label: 'Assignments',      icon: '✎' },
  { href: '/admin/placement-test',  label: 'Placement Test',   icon: '◈' },
  { href: '/admin/live-sessions',   label: 'Live Sessions',    icon: '⊙' },
  { href: '/admin/analytics',       label: 'Analytics',        icon: '↗' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[var(--ink-2)] border-r border-[rgba(245,240,232,0.07)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(245,240,232,0.07)]">
        <Link href="/" className="text-[1.5rem] font-semibold text-[var(--cream)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Elo<span className="text-[var(--gold)]">quence</span>
        </Link>
        <span className="block mt-2 text-[0.6rem] tracking-widest uppercase border border-[rgba(201,168,76,0.3)] text-[var(--gold)] px-2 py-0.5 rounded-sm w-fit">
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
                  className={[
                    'flex items-center gap-3 px-4 py-2.5 rounded-sm text-[0.82rem] tracking-wide transition-all',
                    active
                      ? 'bg-[rgba(201,168,76,0.1)] text-[var(--gold)] border border-[rgba(201,168,76,0.2)]'
                      : 'text-[var(--cream-dim)] hover:text-[var(--cream)] hover:bg-[rgba(245,240,232,0.04)]',
                  ].join(' ')}>
              <span className="text-[0.9rem]">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(245,240,232,0.07)]">
        <Link href="/" className="text-[0.75rem] tracking-widest uppercase text-[var(--muted)] hover:text-[var(--cream)] transition-colors">
          ← Back to Site
        </Link>
      </div>
    </aside>
  )
}