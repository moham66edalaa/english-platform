// 📁 components/courses/EnrollButton.tsx
'use client'

import { useState }  from 'react'
import { useRouter } from 'next/navigation'
import type { PlanRow, CourseRow } from '@/types'

interface Props {
  plan:   PlanRow
  course: CourseRow
  userId: string | null
}

export default function EnrollButton({ plan, course, userId }: Props) {
  const router     = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleEnroll() {
    if (!userId) { router.push('/signup'); return }
    setLoading(true)

    // Create Stripe checkout session via server action / API
    const res = await fetch('/api/payments/checkout', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        planId:      plan.id,
        priceUsd:    plan.price_usd,
        courseTitle: course.title,
        planName:    plan.name,
        successUrl:  `${window.location.origin}/learn/${course.slug}`,
        cancelUrl:   window.location.href,
      }),
    })

    const { url } = await res.json()
    if (url) window.location.href = url
    else     setLoading(false)
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-[var(--gold)] text-[var(--ink)] py-3.5 rounded-sm text-[0.85rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Redirecting…' : `Enrol — ${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} $${plan.price_usd}`}
    </button>
  )
}