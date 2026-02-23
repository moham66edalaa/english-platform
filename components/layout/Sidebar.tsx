// 📁 components/layout/Sidebar.tsx
'use client'

import Link      from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter }    from 'next/navigation'
import type { UserRow } from '@/types'

const NAV = [
  { href: '/dashboard',    label: 'Dashboard',        icon: '⊞' },
  { href: '/my-courses',   label: 'My Courses',        icon: '▶' },
  { href: '/test',         label: 'Placement Test',  icon: '◎' },
  { href: '/assignments',  label: 'Assignments',        icon: '✎' },
  { href: '/certificates', label: 'Certificates',       icon: '✦' },
]

export default function Sidebar({ user }: { user: UserRow }) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[var(--ink-2)] border-r border-[rgba(245,240,232,0.07)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[rgba(245,240,232,0.07)]">
        <Link href="/" className="text-[1.5rem] font-semibold text-[var(--cream)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Elo<span className="text-[var(--gold)]">quence</span>
        </Link>
        {user.cefr_level && (
          <span className="block mt-2 text-[0.65rem] tracking-widest uppercase border border-[rgba(201,168,76,0.3)] text-[var(--gold)] px-2 py-0.5 rounded-sm w-fit">
            Level {user.cefr_level}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href)
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

      {/* User + sign out */}
      <div className="p-4 border-t border-[rgba(245,240,232,0.07)]">
        <div className="text-[0.8rem] text-[var(--cream)] mb-1 truncate">{user.full_name}</div>
        <div className="text-[0.72rem] text-[var(--muted)] truncate mb-3">{user.email}</div>
        <button onClick={handleSignOut}
                className="w-full text-left text-[0.75rem] tracking-widest uppercase text-[var(--muted)] hover:text-[var(--cream)] transition-colors">
          Sign Out
        </button>
      </div>
    </aside>
  )
}