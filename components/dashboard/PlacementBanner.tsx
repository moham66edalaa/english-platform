// 📁 components/dashboard/PlacementBanner.tsx

import Link from 'next/link'

export default function PlacementBanner() {
  return (
    <div className="bg-[linear-gradient(135deg,rgba(201,168,76,0.1),transparent)] border border-[rgba(201,168,76,0.3)] rounded-sm p-6 mb-8 flex items-center justify-between gap-6">
      <div>
        <p className="font-semibold text-[1.1rem] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Discover your English level
        </p>
        <p className="text-[var(--muted)] text-[0.82rem]">
          Take the free 15-minute placement test and we'll match you with the perfect course.
        </p>
      </div>
      <Link href="/placement-test"
            className="flex-shrink-0 bg-[var(--gold)] text-[var(--ink)] px-6 py-2.5 rounded-sm text-[0.78rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all">
        Start Test →
      </Link>
    </div>
  )
}