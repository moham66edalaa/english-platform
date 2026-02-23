// 📁 app/(admin)/admin/courses/[courseId]/sections/page.tsx

import { notFound }     from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SectionEditor    from '@/components/admin/SectionEditor'

export default async function CourseSectionsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const supabase     = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*, sections(*, lessons(*, attachments(*)), quiz:quizzes(*))')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {course.title}
      </h1>
      <p className="text-[var(--muted)] text-[0.85rem] mb-8">Manage sections, lessons, and attachments.</p>
      <SectionEditor course={course} />
    </div>
  )
}