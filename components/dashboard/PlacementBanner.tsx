// components/dashboard/PlacementBanner.tsx

import Link from 'next/link'

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const gold  = '#C9A84C'

export default function PlacementBanner() {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      background: '#111110',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: 16,
      padding: '32px 36px',
      marginBottom: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap' as const,
    }}>
      {/* Gold accent line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, #C9A84C, #e8cc80, #C9A84C, transparent)',
      }} />

      {/* Subtle glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 10,
        }}>
          <span style={{
            fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: gold,
            padding: '3px 10px',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: 4,
          }}>
            Free Test
          </span>
        </div>
        <h3 style={{
          fontFamily: serif, fontWeight: 400, fontSize: '1.35rem',
          color: '#EAE4D2', marginBottom: 6,
        }}>
          Discover your English level
        </h3>
        <p style={{
          fontFamily: sans, fontSize: '0.82rem', color: '#6b7280',
          maxWidth: 440,
        }}>
          Take the free 15-minute placement test and we&apos;ll match you with the perfect course for your level.
        </p>
      </div>

      <Link href="/test" style={{
        position: 'relative',
        flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '14px 32px',
        background: 'linear-gradient(135deg, #C9A84C, #e8cc80)',
        color: '#0d0f14',
        borderRadius: 8,
        fontSize: '0.75rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(201,168,76,0.2)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}>
        Start Test →
      </Link>
    </div>
  )
}
