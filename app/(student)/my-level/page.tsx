import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/helpers'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Level | Eloquence',
}

const teal = '#4CC9A8'
const serif = "'Cormorant Garamond', serif"
const sans = "'DM Sans', sans-serif"

export default async function MyLevelPage() {
  const user = await requireUser()
  const supabase = await createClient()

  const { data: profileData } = await supabase.from('users').select('*').eq('id', user.id).single()
  const profile = profileData as any

  let level: any = null
  let levelCourses: any[] = []

  if (profile?.level_id) {
    const { data: lvl } = await supabase.from('levels').select('*').eq('id', profile.level_id).single()
    level = lvl
    const { data: courses } = await supabase.from('courses').select('*').eq('level_id', profile.level_id).eq('is_published', true)
    levelCourses = courses ?? []
  }

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
            My Level
          </h1>
        </div>

        {level ? (
          <>
            {/* Current Level Card */}
            <div style={{
              backgroundColor: '#111110',
              border: '1px solid rgba(245,240,232,0.07)',
              borderRadius: '16px',
              padding: '40px',
              marginBottom: '40px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <h2 style={{
                  fontFamily: serif,
                  fontSize: '32px',
                  fontWeight: 400,
                  color: '#EAE4D2',
                  margin: 0,
                }}>
                  {level.name}
                </h2>
                {profile?.cefr_level && (
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(76,201,168,0.12)',
                    color: teal,
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}>
                    {profile.cefr_level}
                  </span>
                )}
              </div>
              {level.description && (
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#8A8278',
                  margin: 0,
                }}>
                  {level.description}
                </p>
              )}
            </div>

            {/* Courses in This Level */}
            <div>
              <h3 style={{
                fontFamily: serif,
                fontSize: '24px',
                fontWeight: 400,
                color: '#EAE4D2',
                marginBottom: '20px',
              }}>
                Courses in This Level
              </h3>

              {levelCourses && levelCourses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {levelCourses.map((course: any) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div style={{
                        backgroundColor: '#111110',
                        border: '1px solid rgba(245,240,232,0.07)',
                        borderRadius: '12px',
                        padding: '24px',
                        transition: 'border-color 0.2s',
                      }}>
                        <h4 style={{
                          fontFamily: sans,
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#EAE4D2',
                          margin: '0 0 8px 0',
                        }}>
                          {course.title}
                        </h4>
                        {course.description && (
                          <p style={{
                            fontSize: '14px',
                            color: '#8A8278',
                            margin: 0,
                            lineHeight: 1.6,
                          }}>
                            {course.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '15px', color: '#8A8278' }}>
                  No courses available for this level yet.
                </p>
              )}
            </div>
          </>
        ) : (
          /* No Level Assigned */
          <div style={{
            backgroundColor: '#111110',
            border: '1px solid rgba(245,240,232,0.07)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center' as const,
          }}>
            <p style={{
              fontSize: '16px',
              color: '#8A8278',
              marginBottom: '24px',
            }}>
              No level assigned yet. Take the placement test to get started.
            </p>
            <Link
              href="/test"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                backgroundColor: teal,
                color: '#111110',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Take Placement Test
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
