// 📁 components/courses/PlanSelector.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EnrollButton from './EnrollButton'
import type { CourseRow, PlanRow, EnrollmentRow } from '@/types'

interface Props {
  course:     CourseRow
  plans:      PlanRow[]
  enrollment: (EnrollmentRow & { plans: PlanRow }) | null
  userId:     string | null
}

export default function PlanSelector({ course, plans, enrollment, userId }: Props) {
  const router         = useRouter()
  const [selected, setSelected] = useState<PlanRow | null>(plans[0] ?? null)

  if (enrollment) {
    return (
      <div className="bg-[var(--ink-2)] border border-[rgba(201,168,76,0.3)] rounded-sm p-6">
        <div className="text-[0.7rem] tracking-widest uppercase text-[var(--gold)] mb-2">Enrolled</div>
        <p className="text-[var(--cream)] font-medium mb-4">
          You have the <span className="capitalize">{enrollment.plans?.name}</span> plan.
        </p>
        <button
          onClick={() => router.push(`/learn/${course.slug}`)}
          className="w-full bg-[var(--gold)] text-[var(--ink)] py-3 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all"
        >
          Continue Learning →
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.1)] rounded-sm p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px]"
           style={{ background: 'linear-gradient(135deg,#c9a84c,#e8cc80,#c9a84c)' }} />

      <h3 className="font-semibold text-[1.25rem] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Choose Your Plan
      </h3>

      <div className="flex flex-col gap-3 mb-6">
        {plans.map((plan) => (
          <button key={plan.id}
                  onClick={() => setSelected(plan)}
                  className={[
                    'flex items-center justify-between p-4 rounded-sm border text-left transition-all',
                    selected?.id === plan.id
                      ? 'border-[var(--gold)] bg-[rgba(201,168,76,0.08)]'
                      : 'border-[rgba(245,240,232,0.1)] hover:border-[rgba(201,168,76,0.3)]',
                  ].join(' ')}>
            <div>
              <div className="font-medium capitalize text-[0.9rem]">{plan.name}</div>
              <div className="text-[0.75rem] text-[var(--muted)] mt-0.5">
                {plan.name === 'premium' ? 'With live sessions & feedback' : 'Self-paced learning'}
              </div>
            </div>
            <div className="font-semibold text-[1.25rem] text-[var(--gold)]"
                 style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ${plan.price_usd}
            </div>
          </button>
        ))}
      </div>

      {selected && <EnrollButton plan={selected} course={course} userId={userId} />}
    </div>
  )
}