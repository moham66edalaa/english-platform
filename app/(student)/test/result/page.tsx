import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { CEFR_LABELS, CEFR_TO_COURSE_SLUG } from '@/constants/cefr'
import CEFRResult from '@/components/placement/CEFRResult'

export const metadata = { title: 'Your Result — Eloquence' }

export default async function PlacementResultPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: result } = await supabase
    .from('placement_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  const recommendedSlug = result?.assigned_level
    ? CEFR_TO_COURSE_SLUG[result.assigned_level as keyof typeof CEFR_TO_COURSE_SLUG]
    : null

  const { data: recommendedCourse } = recommendedSlug
    ? await supabase.from('courses').select('title, description, slug').eq('slug', recommendedSlug).single()
    : { data: null }

  return (
    <div className="relative flex flex-col min-h-full bg-[var(--ink)] overflow-hidden">
      {/* طبقات التوهج الذهبي الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 800,
            height: 800,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* المحتوى الرئيسي - مسافة علوية pt-40 (قابلة للتعديل) */}
      <div className="relative z-10 flex-1 px-4 pt-40">
        <div className="max-w-[800px] mx-auto">
          <CEFRResult
            result={result}
            recommendedCourse={recommendedCourse}
            cefrLabels={CEFR_LABELS}
          />
        </div>
      </div>
    </div>
  )
}