import { createClient } from '@/lib/supabase/server'
import TeachersManager from '@/components/admin/TeachersManager'

export const metadata = { title: 'Teachers — Admin Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"
const gold = '#C9A84C'

export default async function OwnerTeachersPage() {
  const supabase = await createClient()

  const { data: teachers } = await supabase
    .from('users')
    .select('*, teacher_courses(count)')
    .eq('role', 'teacher')
    .order('created_at', { ascending: false })

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, cefr_level')
    .order('sort_order')

  const totalTeachers = teachers?.length ?? 0
  const activeTeachers = teachers?.filter((t: any) => t.is_active !== false).length ?? 0

  const stats = [
    { label: 'Total Teachers', value: totalTeachers, icon: '◉' },
    { label: 'Active Teachers', value: activeTeachers, icon: '◎' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; transition:border-color 0.2s, background 0.2s; }
        .stat-card:hover { background-color:#161613; border-color:rgba(201,168,76,0.3); }
      `}</style>

      <div style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Admin Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Teachers
          </h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.9rem', marginBottom: '16px' }}>
                {icon}
              </div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '3rem', lineHeight: 1, color: gold, marginBottom: '8px' }}>
                {value.toLocaleString()}
              </div>
              <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#6A6560', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Teachers table */}
        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>
          All Teachers
        </h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 0.8fr 0.8fr 1fr 1.2fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Name', 'Email', 'Status', 'Courses', 'Joined', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54', textAlign: h === 'Actions' ? 'right' : 'left' }}>
                {h}
              </span>
            ))}
          </div>

          <TeachersManager teachers={teachers ?? []} courses={courses ?? []} />
        </div>
      </div>
    </>
  )
}
