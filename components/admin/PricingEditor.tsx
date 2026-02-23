// 📁 components/admin/PricingEditor.tsx
'use client'

import { useState }     from 'react'
import { useRouter }    from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { PlanRow } from '@/types'

const PLAN_NAMES = ['standard', 'premium'] as const

const PLAN_FEATURES: Record<string, { key: keyof PlanRow; label: string }[]> = {
  standard: [
    { key: 'has_videos',            label: 'Videos'            },
    { key: 'has_pdfs',              label: 'PDFs'              },
    { key: 'has_quizzes',           label: 'Quizzes'           },
    { key: 'has_progress_tracking', label: 'Progress tracking' },
    { key: 'has_certificate',       label: 'Certificate'       },
  ],
  premium: [
    { key: 'has_assignments',         label: 'Assignments'         },
    { key: 'has_instructor_feedback', label: 'Instructor feedback' },
    { key: 'has_live_sessions',       label: 'Live sessions'       },
    { key: 'has_private_group',       label: 'Private group'       },
    { key: 'has_study_plan',          label: 'Study plan'          },
  ],
}

export default function PricingEditor({ courseId, plans }: { courseId: string; plans: PlanRow[] }) {
  const router   = useRouter()
  const supabase = createClient()
  const [prices,  setPrices]  = useState<Record<string, string>>(
    Object.fromEntries(plans.map((p) => [p.name, String(p.price_usd)]))
  )
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    for (const planName of PLAN_NAMES) {
      const existing = plans.find((p) => p.name === planName)
      const price    = parseFloat(prices[planName] ?? '0')

      if (existing) {
        await supabase.from('plans').update({ price_usd: price }).eq('id', existing.id)
      } else {
        await supabase.from('plans').insert({
          course_id:               courseId,
          name:                    planName,
          price_usd:               price,
          has_videos:              true,
          has_pdfs:                true,
          has_quizzes:             true,
          has_progress_tracking:   true,
          has_certificate:         true,
          has_assignments:         planName === 'premium',
          has_instructor_feedback: planName === 'premium',
          has_live_sessions:       planName === 'premium',
          has_private_group:       planName === 'premium',
          has_study_plan:          planName === 'premium',
        })
      }
    }
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="max-w-[600px]">
      <div className="grid grid-cols-2 gap-5 mb-6">
        {PLAN_NAMES.map((planName) => (
          <div key={planName} className="bg-[var(--ink-2)] border border-[rgba(245,240,232,0.1)] rounded-sm p-5">
            <h3 className="font-semibold capitalize mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {planName} Plan
            </h3>
            <label className="text-[0.7rem] tracking-widest uppercase text-[var(--muted)] mb-1.5 block">
              Price (USD)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--gold)]">$</span>
              <input
                type="number" min="0" step="0.01"
                value={prices[planName] ?? ''}
                onChange={(e) => setPrices((prev) => ({ ...prev, [planName]: e.target.value }))}
                className="w-full bg-[var(--ink-3)] border border-[rgba(245,240,232,0.1)] rounded-sm px-3 py-2 text-[0.88rem] text-[var(--cream)] focus:outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>
            <ul className="mt-4 flex flex-col gap-1.5">
              {(PLAN_FEATURES[planName] ?? []).map((f) => (
                <li key={f.key} className="flex items-center gap-2 text-[0.78rem] text-[var(--cream-dim)]">
                  <span className="text-[var(--gold)] text-[0.6rem]">✦</span> {f.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving}
              className="bg-[var(--gold)] text-[var(--ink)] px-8 py-2.5 rounded-sm text-[0.82rem] font-semibold tracking-widest uppercase hover:bg-[var(--gold-light)] transition-all disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Pricing'}
      </button>
    </div>
  )
}