// app/(owner)/admin/levels/page.tsx

import { createClient } from '@/lib/supabase/server'
import LevelsManager from '@/components/admin/LevelsManager'

export const metadata = { title: 'Levels — Admin Panel | Eloquence' }

export default async function OwnerLevelsPage() {
  const supabase = await createClient()

  const { data: levels } = await supabase
    .from('levels')
    .select('*')
    .order('sort_order')

  const { data: students } = await supabase
    .from('users')
    .select('level_id')
    .eq('role', 'student')

  const { data: courses } = await supabase
    .from('courses')
    .select('level_id')

  // Build count maps
  const studentCounts: Record<string, number> = {}
  const courseCounts: Record<string, number> = {}
  for (const s of students ?? []) {
    if ((s as any).level_id) studentCounts[(s as any).level_id] = (studentCounts[(s as any).level_id] ?? 0) + 1
  }
  for (const c of courses ?? []) {
    if ((c as any).level_id) courseCounts[(c as any).level_id] = (courseCounts[(c as any).level_id] ?? 0) + 1
  }

  return (
    <LevelsManager
      levels={levels ?? []}
      studentCounts={studentCounts}
      courseCounts={courseCounts}
    />
  )
}
