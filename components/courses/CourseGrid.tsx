// 📁 components/courses/CourseGrid.tsx

import CourseCard from './CourseCard'
import type { CourseRow, PlanRow } from '@/types'

interface Props {
  courses: (CourseRow & { plans?: PlanRow[] })[]
}

export default function CourseGrid({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--muted)] text-[0.88rem]">
        No courses found for the selected filters.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}