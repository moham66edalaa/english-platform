import { createClient }  from '@/lib/supabase/server'
import AssignmentReview  from '@/components/admin/AssignmentReview'

export const metadata = { title: 'Assignments — Admin Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerAssignmentsPage() {
  const supabase = await createClient()

  const { data: submissions } = await supabase
    .from('assignment_submissions')
    .select('*, users(full_name, email), assignments(title, courses(title))')
    .order('submitted_at', { ascending: false })

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: gold, marginBottom: '8px' }}>
          Admin Panel
        </p>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
          Assignment Submissions
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
          Review and grade student assignment submissions.
        </p>
      </div>

      {/* Component */}
      <AssignmentReview submissions={submissions ?? []} />

    </div>
  )
}
