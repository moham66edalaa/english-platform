// app/(teacher)/layout.tsx
import { requireTeacher } from '@/lib/auth/helpers'
import TeacherSidebar     from '@/components/layout/TeacherSidebar'

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await requireTeacher() // redirects to /dashboard if not teacher or owner

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f14' }}>
      <TeacherSidebar user={{ full_name: user.full_name, email: user.email }} />
      <main style={{
        flex: 1,
        marginLeft: '210px',
        minHeight: '100vh',
        padding: '40px 40px',
        backgroundColor: '#0d0f14',
        color: '#f5f0e8',
      }}>
        {children}
      </main>
    </div>
  )
}
