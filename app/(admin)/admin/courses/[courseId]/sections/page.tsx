// app/(admin)/admin/courses/[courseId]/sections/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SectionEditor from '@/components/admin/SectionEditor'

// تعريف نوع مؤقت (يمكن استبداله بالأنواع التلقائية من قاعدة البيانات)
type CourseWithDetails = {
  id: string
  title: string
  description: string | null
  slug: string
  sections: any[] // يمكن تحسين هذا النوع لاحقاً
}

export default async function CourseSectionsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const supabase = await createClient()

  // استخدام التحويل الصريح للنوع
  const { data: course } = await supabase
    .from('courses')
    .select('*, sections(*)')
    .eq('id', courseId)
    .single() as { data: CourseWithDetails | null }

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