import { createClient } from '@/lib/supabase/server'
import StudentsManager from '@/components/admin/StudentsManager'

export const metadata = { title: 'Students — Admin Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans = "'Raleway', sans-serif"
const gold = '#C9A84C'

export default async function OwnerStudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from('users')
    .select('*, enrollments(count), group_members(count)')
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  const { data: groups } = await supabase
    .from('groups')
    .select('id, name, courses(title)')
    .eq('is_active', true)
    .order('name')

  const { data: levels } = await supabase
    .from('levels')
    .select('id, name, slug')
    .order('sort_order')

  const total = students?.length ?? 0
  const withLevel = students?.filter((s: any) => s.cefr_level).length ?? 0
  const withoutLevel = total - withLevel

  const stats = [
    { label: 'Total Students', value: total, icon: '◉' },
    { label: 'With Level', value: withLevel, icon: '◎' },
    { label: 'Without Level', value: withoutLevel, icon: '○' },
  ]

  return (
    <>
      <style>{`
        .stat-card { background-color:#111110; border:1px solid rgba(245,240,232,0.07); border-radius:16px; padding:28px 28px 24px; }
      `}</style>

      <div style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '36px' }}>
          <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8A6F35', marginBottom: '8px' }}>
            Admin Panel
          </p>
          <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2' }}>
            Students
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {stats.map(({ label, value, icon }) => (
            <div key={label} className="stat-card">
              <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.9rem', marginBottom: '16px' }}>{icon}</div>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: '3rem', lineHeight: 1, color: gold, marginBottom: '8px' }}>{value.toLocaleString()}</div>
              <div style={{ fontFamily: sans, fontWeight: 400, fontSize: '0.78rem', color: '#6A6560' }}>{label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: '1.4rem', color: '#EAE4D2', marginBottom: '16px' }}>All Students</h2>

        <div style={{ backgroundColor: '#111110', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 0.8fr 0.7fr 0.7fr 0.8fr 0.7fr 1.2fr', padding: '14px 24px', borderBottom: '1px solid rgba(245,240,232,0.07)' }}>
            {['Name', 'Email', 'Level', 'Groups', 'Courses', 'Status', 'Joined', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: sans, fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5E5A54', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>
          <StudentsManager students={students ?? []} groups={groups ?? []} levels={levels ?? []} />
        </div>
      </div>
    </>
  )
}
