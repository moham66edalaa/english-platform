// 📁 app/(admin)/admin/students/page.tsx

import { createClient } from '@/lib/supabase/server'
import StudentTable     from '@/components/admin/StudentTable'

export const metadata = { title: 'Students — Admin' }

export default async function AdminStudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('users')
    .select('*, enrollments(count)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="font-light text-[2rem] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Students
      </h1>
      <StudentTable students={students ?? []} />
    </div>
  )
}