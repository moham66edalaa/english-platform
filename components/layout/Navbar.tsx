// components/layout/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    closeMenu()
  }

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="logo">
        Elo<span>quence</span>
      </Link>
      <div className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
        {!loading && (
          user ? (
            // روابط الطالب (تظهر فقط بعد تسجيل الدخول)
            <>
              <Link href="/dashboard" onClick={closeMenu}>Dashboard</Link>
              <Link href="/my-courses" onClick={closeMenu}>My Courses</Link>
              <Link href="/test" onClick={closeMenu}>Placement Test</Link>
              <Link href="/assignments" onClick={closeMenu}>Assignments</Link>
              <Link href="/certificates" onClick={closeMenu}>Certificates</Link>
              <button
                onClick={handleSignOut}
                className="text-[0.85rem] font-medium tracking-[0.1em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors bg-transparent border-none cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            // روابط الزوار (لغير المسجلين)
            <>
              <Link href="/#courses" onClick={closeMenu}>Courses</Link>
              <Link href="/#placement" onClick={closeMenu}>Placement Test</Link>
              <Link href="/#pricing" onClick={closeMenu}>Pricing</Link>
              <Link href="/#about" onClick={closeMenu}>About</Link>
              <Link href="/login" style={{ color: 'var(--cream-dim)' }}>Sign In</Link>
              <Link href="/signup" className="nav-cta" onClick={closeMenu}>Start Learning</Link>
            </>
          )
        )}
      </div>
      <button
        className="hamburger"
        id="hamburger"
        aria-label="Menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span><span></span><span></span>
      </button>
    </nav>
  )
}