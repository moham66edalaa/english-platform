// 📁 app/(admin)/admin/assignments/page.tsx

import { createClient }  from '@/lib/supabase/server'
import AssignmentReview  from '@/components/admin/AssignmentReview'

export const metadata = { title: 'Assignments — Admin' }

export default async function AdminAssignmentsPage() {
  const supabase = await createClient()

  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select('*, users(full_name, email), assignments(title, courses(title))')
    .order('submitted_at', { ascending: false })

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Assignment Submissions
      </h1>
      <AssignmentReview submissions={submissions ?? []} />
    </div>
  )
}