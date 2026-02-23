// app/(admin)/admin/courses/[courseId]/pricing/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PricingEditor from '@/components/admin/PricingEditor'

// تعريف نوع مؤقت (يمكن استبداله بالأنواع التلقائية من قاعدة البيانات)
type CourseWithPlans = {
  id: string
  title: string
  description: string | null
  slug: string
  plans: any[] // يمكن تحسين هذا النوع لاحقاً باستخدام Database['public']['Tables']['plans']['Row']
}

export default async function CoursePricingPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const supabase = await createClient()

  // استخدام التحويل الصريح للنوع
  const { data: course } = await supabase
    .from('courses')
    .select('*, plans(*)')
    .eq('id', courseId)
    .single() as { data: CourseWithPlans | null }

  if (!course) notFound()

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Pricing — {course.title}
      </h1>
      <p className="text-[var(--muted)] text-[0.85rem] mb-8">Set Standard and Premium plan prices.</p>
      <PricingEditor courseId={course.id} plans={course.plans ?? []} />
    </div>
  )
}