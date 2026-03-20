import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/helpers'

export const metadata: Metadata = {
  title: 'Progress | Eloquence',
}

const teal = '#4CC9A8'
const serif = "'Cormorant Garamond', serif"
const sans = "'DM Sans', sans-serif"

export default async function ProgressPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(title, id)')
    .eq('user_id', user.id)

  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select('*, lessons(section_id, sections:section_id(course_id))')
    .eq('user_id', user.id)
    .eq('completed', true)

  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('score, passed')
    .eq('user_id', user.id)

  const { data: attendance } = await supabase
    .from('attendance')
    .select('status')
    .eq('user_id', user.id)

  // Calculate stats
  const totalEnrollments = enrollments?.length ?? 0
  const totalCompletedLessons = lessonProgress?.length ?? 0
  const totalQuizzes = quizAttempts?.length ?? 0

  const attendancePresent = attendance?.filter((a: any) => a.status === 'present').length ?? 0
  const attendanceTotal = attendance?.length ?? 0
  const attendanceRate = attendanceTotal > 0 ? Math.round((attendancePresent / attendanceTotal) * 100) : 0

  const avgScore = totalQuizzes > 0
    ? Math.round((quizAttempts!.reduce((sum: number, a: any) => sum + (a.score ?? 0), 0) / totalQuizzes))
    : 0

  const passedQuizzes = quizAttempts?.filter((a: any) => a.passed).length ?? 0
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0

  // Calculate per-course progress
  const courseProgress = (enrollments ?? []).map((enrollment: any) => {
    const courseId = enrollment.courses?.id
    const completedForCourse = (lessonProgress ?? []).filter(
      (lp: any) => lp.lessons?.sections?.course_id === courseId
    ).length

    // We don't have total lessons count from the query, so we show completed count
    return {
      title: enrollment.courses?.title ?? 'Untitled Course',
      courseId,
      completed: completedForCourse,
      progress: enrollment.progress ?? 0,
    }
  })

  const stats = [
    { label: 'Courses Enrolled', value: totalEnrollments },
    { label: 'Lessons Completed', value: totalCompletedLessons },
    { label: 'Quizzes Taken', value: totalQuizzes },
    { label: 'Attendance Rate', value: `${attendanceRate}%` },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111110', color: '#EAE4D2', fontFamily: sans }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            color: teal,
          }}>
            My Learning
          </span>
          <h1 style={{
            fontFamily: serif,
            fontSize: '42px',
            fontWeight: 300,
            color: '#EAE4D2',
            margin: '8px 0 0 0',
          }}>
            Progress
          </h1>
        </div>

        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: '#111110',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center' as const,
            }}>
              <div style={{
                fontFamily: serif,
                fontSize: '32px',
                fontWeight: 400,
                color: '#EAE4D2',
                marginBottom: '8px',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase' as const,
                color: '#8A8278',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Course Progress */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: serif,
            fontSize: '24px',
            fontWeight: 400,
            color: '#EAE4D2',
            marginBottom: '20px',
          }}>
            Course Progress
          </h2>

          {courseProgress.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {courseProgress.map((course: any) => {
                const percent = Math.min(Math.round(course.progress * 100), 100)
                return (
                  <div key={course.courseId} style={{
                    backgroundColor: '#111110',
                    border: '1px solid rgba(245,240,232,0.07)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#EAE4D2',
                      }}>
                        {course.title}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#8A8278',
                      }}>
                        {course.completed} lessons completed
                      </span>
                    </div>
                    <div style={{
                      height: '6px',
                      backgroundColor: 'rgba(245,240,232,0.07)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percent}%`,
                        backgroundColor: teal,
                        borderRadius: '3px',
                      }} />
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#5E5A54',
                      marginTop: '8px',
                      textAlign: 'right' as const,
                    }}>
                      {percent}%
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ fontSize: '15px', color: '#8A8278' }}>
              You are not enrolled in any courses yet.
            </p>
          )}
        </div>

        {/* Quiz Performance */}
        <div>
          <h2 style={{
            fontFamily: serif,
            fontSize: '24px',
            fontWeight: 400,
            color: '#EAE4D2',
            marginBottom: '20px',
          }}>
            Quiz Performance
          </h2>

          {totalQuizzes > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              <div style={{
                backgroundColor: '#111110',
                border: '1px solid rgba(245,240,232,0.07)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center' as const,
              }}>
                <div style={{
                  fontFamily: serif,
                  fontSize: '36px',
                  fontWeight: 400,
                  color: '#EAE4D2',
                  marginBottom: '8px',
                }}>
                  {avgScore}%
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  color: '#8A8278',
                }}>
                  Average Score
                </div>
              </div>
              <div style={{
                backgroundColor: '#111110',
                border: '1px solid rgba(245,240,232,0.07)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center' as const,
              }}>
                <div style={{
                  fontFamily: serif,
                  fontSize: '36px',
                  fontWeight: 400,
                  color: teal,
                  marginBottom: '8px',
                }}>
                  {passRate}%
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                  color: '#8A8278',
                }}>
                  Pass Rate
                </div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '15px', color: '#8A8278' }}>
              No quizzes taken yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
