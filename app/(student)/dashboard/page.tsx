// app/(student)/dashboard/page.tsx
import { requireUser } from '@/lib/auth/helpers'
import { createClient } from '@/lib/supabase/server'
import { computeProgress } from '@/lib/utils'
import PlacementBanner from '@/components/dashboard/PlacementBanner'
import ContinueWatching from '@/components/dashboard/ContinueWatching'
import EnrolledCourseCard from '@/components/dashboard/EnrolledCourseCard'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — Eloquence' }

const serif = "'Cormorant Garamond', serif"
const sans  = "'DM Sans', sans-serif"
const teal  = '#4CC9A8'

export default async function DashboardPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`*, courses(*), plans(*)`)
    .eq('user_id', user.id)

  const { data: allProgress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', user.id)

  const courseIds = (enrollments ?? []).map((e: any) => e.courses?.id).filter(Boolean)

  // Get sections for enrolled courses, then get their lessons
  const { data: courseSections } = courseIds.length > 0
    ? await supabase
        .from('sections')
        .select('id, course_id')
        .in('course_id', courseIds)
    : { data: [] }

  const sectionIds = (courseSections ?? []).map((s: any) => s.id)
  const { data: allLessons } = sectionIds.length > 0
    ? await supabase
        .from('lessons')
        .select('id, section_id')
        .in('section_id', sectionIds)
    : { data: [] }

  // Build a map: lesson_id → course_id
  const sectionToCourse = new Map((courseSections ?? []).map((s: any) => [s.id, s.course_id]))
  const lessonsWithCourse = (allLessons ?? []).map((l: any) => ({
    ...l,
    course_id: sectionToCourse.get(l.section_id),
  }))

  const completedIds = new Set((allProgress ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id))
  const firstName = (user.full_name ?? 'Student').replace(/^Demo\s*/i, '').split(' ')[0] || 'Student'

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p style={{
          fontFamily: sans, fontSize: '0.62rem', fontWeight: 600,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: teal, marginBottom: 10,
        }}>
          Student Dashboard
        </p>
        <h1 style={{
          fontFamily: serif, fontWeight: 300, fontSize: '2.6rem',
          color: '#EAE4D2', lineHeight: 1.15, marginBottom: 6,
        }}>
          Welcome back, <em style={{ fontStyle: 'italic', color: teal }}>{firstName}</em>
        </h1>
        <p style={{ fontFamily: sans, fontSize: '0.88rem', color: '#6b7280' }}>
          {user.cefr_level
            ? `Your current level: ${user.cefr_level}`
            : 'Take the placement test to discover your level.'}
        </p>
      </div>

      {/* Placement test banner if not taken */}
      {!user.cefr_level && <PlacementBanner />}

      {/* Continue watching */}
      {(enrollments ?? []).length > 0 && (
        <ContinueWatching enrollments={enrollments ?? []} progress={allProgress ?? []} />
      )}

      {/* Enrolled courses */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{
          fontFamily: serif, fontWeight: 400, fontSize: '1.5rem',
          color: '#EAE4D2', marginBottom: 24,
        }}>
          My Courses
        </h2>

        {(enrollments ?? []).length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(26,30,40,0.8), rgba(13,15,20,0.9))',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: 16,
            padding: '60px 40px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(76,201,168,0.08)',
              border: '1px solid rgba(76,201,168,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '1.5rem',
            }}>
              ▶
            </div>
            <p style={{
              fontFamily: serif, fontSize: '1.2rem', color: '#EAE4D2',
              marginBottom: 8,
            }}>
              No courses yet
            </p>
            <p style={{
              fontFamily: sans, fontSize: '0.85rem', color: '#6b7280',
              marginBottom: 24, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Browse our expert-led courses and start your English mastery journey.
            </p>
            <Link href="/courses" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #4CC9A8, #80e8cc)',
              color: '#0d0f14', borderRadius: 8,
              fontSize: '0.78rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              textDecoration: 'none',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {(enrollments ?? []).map((enrollment: any) => {
              const courseId = enrollment.courses?.id
              const totalLessons = lessonsWithCourse.filter(
                (l: any) => l.course_id === courseId
              ).length
              const completedLessons = lessonsWithCourse.filter(
                (l: any) => l.course_id === courseId && completedIds.has(l.id)
              ).length
              const progress = computeProgress(totalLessons, completedLessons)

              return (
                <EnrolledCourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  progress={progress}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
