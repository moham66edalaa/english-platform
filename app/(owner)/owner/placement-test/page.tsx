import { createClient } from '@/lib/supabase/server'
import QuizBuilder      from '@/components/admin/QuizBuilder'

export const metadata = { title: 'Placement Test — Owner Panel | Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'Raleway', sans-serif"
const gold  = '#C9A84C'

export default async function OwnerPlacementTestPage() {
  const supabase = await createClient()

  const { data: questions } = await supabase
    .from('placement_test_questions')
    .select('*')
    .order('sort_order')

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ fontFamily: sans, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: gold, marginBottom: '8px' }}>
          Owner Panel
        </p>
        <h1 style={{ fontFamily: serif, fontWeight: 300, fontSize: '2.4rem', color: '#EAE4D2', marginBottom: '6px' }}>
          Placement Test Questions
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.82rem', color: '#5E5A54' }}>
          Manage the MCQ bank. Questions are grouped by CEFR level.
        </p>
      </div>

      {/* Component */}
      <QuizBuilder questions={questions ?? []} isPlacementTest />

    </div>
  )
}
