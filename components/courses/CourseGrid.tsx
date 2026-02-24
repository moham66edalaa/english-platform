// 📁 components/courses/CourseGrid.tsx
import CourseCard from './CourseCard'
import type { CourseRow, PlanRow } from '@/types'

interface Props {
  courses: (CourseRow & { plans?: PlanRow[] })[]
}

export default function CourseGrid({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding:   '4rem 0',
        color:     '#6b7280',
        fontSize:  '0.88rem',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.4 }}>◈</div>
        No courses found for the selected filters.
      </div>
    )
  }

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap:                 '1.25rem',
    }}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
