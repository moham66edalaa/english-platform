// 📁 app/(public)/placement-test/page.tsx
// Marketing intro page. Unauthenticated users are prompted to sign up first.
// Authenticated users can start the test.

import Link   from 'next/link'
import { getUser } from '@/lib/auth/helpers'
import { CEFR_LEVELS, CEFR_LABELS } from '@/constants/cefr'

export const metadata = { title: 'Placement Test — Eloquence' }

export default async function PlacementTestIntroPage() {
  const user = await getUser()

  return (
    <div className="min-h-screen pt-28 pb-20 px-12">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--gold)] mb-4 flex items-center justify-center gap-3">
          <span className="w-6 h-px bg-[var(--gold)]" /> Free · 15 Minutes
        </p>
        <h1 className="font-light leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem,5vw,4rem)' }}>
          Find your <em className="italic text-[var(--gold)]">exact</em> English level
        </h1>
        <p className="text-[var(--cream-dim)] leading-relaxed mb-12 max-w-[560px] mx-auto text-[1rem]">
          30 multiple-choice questions across grammar, vocabulary, and reading. Auto-graded
          in seconds. You'll be placed on the CEFR scale from A1 to C1 and matched with
          the perfect course.
        </p>

        {/* CEFR level grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-[600px] mx-auto mb-12">
          {CEFR_LEVELS.map((level) => (
            <div key={level}
                 className="border border-[rgba(201,168,76,0.2)] bg-[var(--ink-2)] rounded-sm p-4 text-center hover:border-[var(--gold)] transition-colors">
              <div className="font-bold text-[var(--gold)] text-[1.75rem]"
                   style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {level}
              </div>
              <div className="text-[0.7rem] text-[var(--muted)] mt-1">{CEFR_LABELS[level]}</div>
            </div>
          ))}
        </div>

        {user ? (
          <Link
            href="/placement-test"
            className="inline-block bg-[var(--gold)] text-[var(--ink)] px-10 py-4 rounded-sm text-[0.9rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] hover:-translate-y-0.5 transition-all"
          >
            Start the Test →
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/signup"
              className="inline-block bg-[var(--gold)] text-[var(--ink)] px-10 py-4 rounded-sm text-[0.9rem] font-semibold tracking-wide uppercase hover:bg-[var(--gold-light)] hover:-translate-y-0.5 transition-all"
            >
              Create Free Account & Start →
            </Link>
            <p className="text-[0.82rem] text-[var(--muted)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--gold)] hover:underline">Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}