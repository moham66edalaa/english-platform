// 📁 app/(student)/layout.tsx

import { requireUser } from '@/lib/auth/helpers'
import Sidebar         from '@/components/layout/Sidebar'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="flex min-h-screen bg-[var(--ink)]">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 p-10 min-h-screen">
        {children}
      </main>
    </div>
  )
}