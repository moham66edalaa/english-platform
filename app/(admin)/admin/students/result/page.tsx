// 📁 app/(student)/placement-test/result/page.tsx

import { requireUser }            from '@/lib/auth/helpers'
import { createClient }           from '@/lib/supabase/server'
import { CEFR_LABELS, CEFR_TO_COURSE_SLUG } from '@/constants/cefr'
import CEFRResult                 from '@/components/placement/CEFRResult'

export const metadata = { title: 'Your Result — Eloquence' }

export default async function PlacementResultPage() {
  const user     = await requireUser()
  const supabase = await createClient()

  // Get most recent placement result
  const { data: result } = await supabase
    .from('placement_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  // Get recommended course
  const recommendedSlug = result?.assigned_level
    ? CEFR_TO_COURSE_SLUG[result.assigned_level as keyof typeof CEFR_TO_COURSE_SLUG]
    : null

  const { data: recommendedCourse } = recommendedSlug
    ? await supabase.from('courses').select('*, plans(*)').eq('slug', recommendedSlug).single()
    : { data: null }

  return (
    <div className="max-w-[800px] mx-auto">
      <CEFRResult
        result={result}
        recommendedCourse={recommendedCourse}
        cefrLabels={CEFR_LABELS}
      />
    </div>
  )
}