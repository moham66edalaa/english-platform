// 📁 app/(admin)/layout.tsx

import { requireAdmin } from '@/lib/auth/helpers'
import AdminSidebar     from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()   // Redirects to /dashboard if not admin
  return (
    <div className="flex min-h-screen bg-[var(--ink)]">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-10 min-h-screen">{children}</main>
    </div>
  )
}