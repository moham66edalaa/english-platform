// 📁 components/layout/Footer.tsx

import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/#courses',   label: 'Courses' },
  { href: '/#placement', label: 'Placement Test' },
  { href: '/#pricing',   label: 'Pricing' },
  { href: '/privacy',    label: 'Privacy Policy' },
  { href: '/terms',      label: 'Terms of Service' },
  { href: '/contact',    label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(245,240,232,0.07)] px-12 py-8 flex flex-wrap items-center justify-between gap-6">
      <Link
        href="/"
        className="text-xl font-semibold text-[var(--cream)]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Elo<span className="text-[var(--gold)]">quence</span>
      </Link>

      <div className="flex flex-wrap gap-8">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[0.78rem] text-[var(--muted)] tracking-wide hover:text-[var(--cream)] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <p className="text-[0.75rem] text-[var(--muted)]">
        © {new Date().getFullYear()} Eloquence English Platform. All rights reserved.
      </p>
    </footer>
  )
}