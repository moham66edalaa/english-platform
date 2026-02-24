// 📁 app/(admin)/admin/placement-test/page.tsx

import { createClient } from '@/lib/supabase/server'
import QuizBuilder      from '@/components/admin/QuizBuilder'

export const metadata = { title: 'Placement Test — Admin' }

export default async function PlacementTestAdminPage() {
  const supabase = await createClient()

  const { data: questions } = await supabase
    .from('placement_test_questions')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Placement Test Questions
      </h1>
      <p className="text-[var(--muted)] text-[0.85rem] mb-8">
        Manage the MCQ bank. Questions are grouped by CEFR level.
      </p>
      <QuizBuilder questions={questions ?? []} isPlacementTest />
    </div>
  )
}
