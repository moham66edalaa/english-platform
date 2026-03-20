// app/(teacher)/teacher/assignments/page.tsx

import { createClient }  from '@/lib/supabase/server'
import { requireUser }   from '@/lib/auth/helpers'
import AssignmentReview  from '@/components/admin/AssignmentReview'
import AssignmentCreator from '@/components/admin/AssignmentCreator'

export const metadata = { title: 'Assignments — Eloquence Teacher Panel' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const blue  = '#4CA8C9'

export default async function TeacherAssignmentsPage() {
  const user = await requireUser()
  const supabase = await createClient()

  // Get teacher's assigned course IDs
  const { data: teacherCourses } = await supabase
    .from('teacher_courses')
    .select('course_id')
    .eq('teacher_id', user.id)

  const courseIds = (teacherCourses ?? []).map((tc: any) => tc.course_id)

  // Get course details for the create assignment dropdown
  const { data: coursesData } = courseIds.length > 0
    ? await supabase.from('courses').select('id, title').in('id', courseIds)
    : { data: [] }

  // Only fetch submissions for assignments in teacher's courses
  const { data: submissions } = courseIds.length > 0
    ? await supabase
        .from('assignment_submissions')
        .select('*, users(full_name, email), assignments(title, course_id, courses(title))')
        .in('assignments.course_id' as any, courseIds)
        .order('submitted_at', { ascending: false })
    : { data: [] }

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '36px' }}>
        <div>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: blue, marginBottom: '8px' }}>
            Teacher Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
            Homework
          </h1>
          <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
            Create assignments and review student submissions.
          </p>
        </div>
        <AssignmentCreator courses={coursesData ?? []} />
      </div>

      {/* Content */}
      <AssignmentReview submissions={submissions ?? []} />
    </div>
  )
}
