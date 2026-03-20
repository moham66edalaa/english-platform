// 📁 types/index.ts
// App-level types that extend or compose database row types.

import type { Database, CEFRLevel } from './database'

export type { CEFRLevel, UserRole, CourseCategory, PlanName, MaterialType, SubscriptionStatus, AttendanceStatus } from './database'

/* ── Row shorthands ── */
export type UserRow               = Database['public']['Tables']['users']['Row']
export type CourseRow             = Database['public']['Tables']['courses']['Row']
export type PlanRow               = Database['public']['Tables']['plans']['Row']
export type SectionRow            = Database['public']['Tables']['sections']['Row']
export type LessonRow             = Database['public']['Tables']['lessons']['Row']
export type AttachmentRow         = Database['public']['Tables']['attachments']['Row']
export type QuizRow               = Database['public']['Tables']['quizzes']['Row']
export type QuizQuestionRow       = Database['public']['Tables']['quiz_questions']['Row']
export type QuizAttemptRow        = Database['public']['Tables']['quiz_attempts']['Row']
export type EnrollmentRow         = Database['public']['Tables']['enrollments']['Row']
export type LessonProgressRow     = Database['public']['Tables']['lesson_progress']['Row']
export type PlacementQuestionRow  = Database['public']['Tables']['placement_test_questions']['Row']
export type PlacementResultRow    = Database['public']['Tables']['placement_test_results']['Row']
export type AssignmentRow         = Database['public']['Tables']['assignments']['Row']
export type SubmissionRow         = Database['public']['Tables']['assignment_submissions']['Row']
export type PaymentRow            = Database['public']['Tables']['payments']['Row']
export type CertificateRow        = Database['public']['Tables']['certificates']['Row']
export type LiveSessionRow        = Database['public']['Tables']['live_sessions']['Row']
export type GroupRow              = Database['public']['Tables']['groups']['Row']
export type GroupMemberRow        = Database['public']['Tables']['group_members']['Row']
export type TeacherCourseRow      = Database['public']['Tables']['teacher_courses']['Row']
export type AttendanceRow         = Database['public']['Tables']['attendance']['Row']
export type AnnouncementRow       = Database['public']['Tables']['announcements']['Row']
export type ScheduledSessionRow   = Database['public']['Tables']['scheduled_sessions']['Row']
export type PlatformSettingRow    = Database['public']['Tables']['platform_settings']['Row']
export type LevelRow              = Database['public']['Tables']['levels']['Row']
export type MaterialRow           = Database['public']['Tables']['materials']['Row']
export type SubscriptionRow       = Database['public']['Tables']['subscriptions']['Row']

/* ── Composite / enriched types ── */

/** Course with its two pricing plans pre-loaded */
export interface CourseWithPlans extends CourseRow {
  plans: PlanRow[]
}

/** Course with full structure for the player */
export interface CourseWithSections extends CourseRow {
  sections: (SectionRow & {
    lessons: (LessonRow & {
      attachments: AttachmentRow[]
    })[]
    quiz: QuizRow | null
  })[]
}

/** MCQ option shape stored in quiz_questions.options JSON */
export interface QuizOption {
  id:   string   // e.g. "a" | "b" | "c" | "d"
  text: string
}

/** Placement test question with parsed options */
export interface PlacementQuestion extends Omit<PlacementQuestionRow, 'options'> {
  options: QuizOption[]
}

/** Student dashboard — enrolled course + computed progress */
export interface EnrolledCourse {
  enrollment:       EnrollmentRow
  course:           CourseRow
  plan:             PlanRow
  progressPercent:  number        // 0-100
  lastLesson:       LessonRow | null
}

/** Placement test submission payload */
export interface PlacementSubmission {
  answers: Record<string, string>  // { questionId: selectedOptionId }
}

/** Placement test grader result */
export interface PlacementGraderResult {
  assignedLevel:  CEFRLevel
  scoreByLevel:   Record<CEFRLevel, number>   // percentage per band
  totalQuestions: number
  correctAnswers: number
}

/** Quiz submission payload */
export interface QuizSubmission {
  quizId:  string
  answers: Record<string, string>
}

/** Assignment submission payload */
export interface AssignmentSubmissionPayload {
  assignmentId: string
  contentText?: string
  contentUrl?:  string
}