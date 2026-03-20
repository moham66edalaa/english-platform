// app/(teacher)/teacher/materials/page.tsx

import { createClient } from '@/lib/supabase/server'
import { requireTeacher } from '@/lib/auth/helpers'
import MaterialsManager from '@/components/admin/MaterialsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Materials — Teacher Panel | Eloquence',
}

export default async function TeacherMaterialsPage() {
  const user = await requireTeacher()
  const supabase = await createClient()

  const { data: materials } = await supabase
    .from('materials')
    .select('*, courses(title)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  // Get teacher's courses for the dropdown
  const { data: teacherCourses } = await supabase
    .from('teacher_courses')
    .select('course_id, courses(id, title)')
    .eq('teacher_id', user.id)

  const courses = (teacherCourses ?? []).map((tc: any) => ({
    id: tc.course_id,
    title: tc.courses?.title ?? 'Untitled',
  }))

  return (
    <MaterialsManager
      materials={(materials ?? []) as any[]}
      teacherId={user.id}
      courses={courses}
    />
  )
}
