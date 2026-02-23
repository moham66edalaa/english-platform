// 📁 components/layout/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/#courses',   label: 'Courses' },
  { href: '/#placement', label: 'Placement Test' },
  { href: '/#pricing',   label: 'Pricing' },
  { href: '/#about',     label: 'About' },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-[900] flex items-center justify-between transition-all duration-300',
        scrolled
          ? 'bg-[rgba(13,15,20,0.92)] backdrop-blur-md border-b border-[rgba(201,168,76,0.15)] px-12 py-4'
          : 'px-12 py-6 border-b border-transparent',
      ].join(' ')}
    >
      {/* ── Logo ── */}
      <Link
        href="/"
        className="font-serif text-[1.75rem] font-semibold tracking-wide text-[var(--cream)]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Elo<span className="text-[var(--gold)]">quence</span>
      </Link>

      {/* ── Desktop links ── */}
      <div className="hidden md:flex items-center gap-10">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[0.78rem] font-medium tracking-[0.1em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/login"
          className="text-[0.78rem] font-medium tracking-[0.1em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-[var(--gold)] text-[var(--ink)] px-6 py-2.5 rounded-sm text-[0.75rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] hover:-translate-y-0.5 transition-all"
        >
          Start Learning
        </Link>
      </div>

      {/* ── Hamburger (mobile) ── */}
      <button
        className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-x-[4.5px] translate-y-[6.5px]' : ''}`} />
        <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-[1.5px] bg-[var(--cream)] transition-all duration-300 ${menuOpen ? '-rotate-45 translate-x-[4.5px] -translate-y-[6.5px]' : ''}`} />
      </button>

      {/* ── Mobile overlay menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[rgba(13,15,20,0.98)] z-[800] flex flex-col items-center justify-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="text-xl font-medium tracking-[0.12em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={closeMenu} className="text-xl font-medium tracking-[0.12em] uppercase text-[var(--cream-dim)] hover:text-[var(--gold)] transition-colors">
            Sign In
          </Link>
          <Link href="/signup" onClick={closeMenu} className="bg-[var(--gold)] text-[var(--ink)] px-8 py-3 rounded-sm text-sm font-semibold tracking-wide uppercase">
            Start Learning
          </Link>
        </div>
      )}
    </nav>
  )
}