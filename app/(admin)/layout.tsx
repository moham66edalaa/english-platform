// app/(admin)/layout.tsx
import { requireAdmin } from '@/lib/auth/helpers'
import AdminSidebar     from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin() // redirects to /dashboard if not admin

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f14' }}>
      <AdminSidebar />
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