// app/(admin)/admin/courses/[courseId]/pricing/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PricingEditor from '@/components/admin/PricingEditor'

export default async function CoursePricingPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const supabase = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, plans(*)')
    .eq('id', courseId)
    .single() as { data: any }

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