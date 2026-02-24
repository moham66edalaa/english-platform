// 📁 app/(admin)/admin/courses/[courseId]/page.tsx

import { notFound }     from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseForm       from '@/components/admin/CourseForm'

export const metadata = { title: 'Edit Course — Admin' }

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const supabase     = await createClient()

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()

  if (!course) notFound()

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Edit Course
      </h1>
      <CourseForm course={course} />
    </div>
  )
}
