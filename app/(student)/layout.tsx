// app/(student)/layout.tsx
import { requireUser } from '@/lib/auth/helpers'
import Navbar from '@/components/layout/Navbar'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <div className="min-h-screen bg-[var(--ink)]">
      <Navbar />
      <main className="pt-40 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}