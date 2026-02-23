// 📁 types/database.ts
// Auto-generated Supabase types — regenerate with:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type UserRole = 'student' | 'admin'
export type CourseCategory = 'level' | 'skill' | 'academic' | 'exam'
export type PlanName = 'standard' | 'premium'
export type PaymentStatus = 'pending' | 'completed' | 'refunded' | 'failed'
export type AssignmentStatus = 'submitted' | 'reviewed'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id:         string
          email:      string
          full_name:  string | null
          avatar_url: string | null
          role:       UserRole
          cefr_level: CEFRLevel | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }

      courses: {
        Row: {
          id:            string
          slug:          string
          title:         string
          description:   string | null
          thumbnail_url: string | null
          trailer_url:   string | null
          category:      CourseCategory
          cefr_level:    CEFRLevel | null
          skill_type:    'grammar' | 'speaking' | null
          academic_year: '1st_secondary' | '2nd_secondary' | '3rd_secondary' | null
          exam_type:     'IELTS' | 'TOEFL' | null
          is_published:  boolean
          sort_order:    number
          created_at:    string
          updated_at:    string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }

      plans: {
        Row: {
          id:                      string
          course_id:               string
          name:                    PlanName
          price_usd:               number
          has_videos:              boolean
          has_pdfs:                boolean
          has_quizzes:             boolean
          has_progress_tracking:   boolean
          has_certificate:         boolean
          has_assignments:         boolean
          has_instructor_feedback: boolean
          has_live_sessions:       boolean
          has_private_group:       boolean
          has_study_plan:          boolean
          created_at:              string
        }
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['plans']['Insert']>
      }

      sections: {
        Row: {
          id:         string
          course_id:  string
          title:      string
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sections']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sections']['Insert']>
      }

      lessons: {
        Row: {
          id:           string
          section_id:   string
          title:        string
          description:  string | null
          video_url:    string | null
          duration_sec: number | null
          sort_order:   number
          is_preview:   boolean
          created_at:   string
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }

      attachments: {
        Row: {
          id:         string
          lesson_id:  string
          name:       string
          file_url:   string
          file_type:  string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attachments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['attachments']['Insert']>
      }

      quizzes: {
        Row: {
          id:         string
          section_id: string | null
          title:      string
          pass_score: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quizzes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quizzes']['Insert']>
      }

      quiz_questions: {
        Row: {
          id:             string
          quiz_id:        string
          question_text:  string
          options:        Json   // [{ id: string, text: string }]
          correct_option: string
          explanation:    string | null
          sort_order:     number
        }
        Insert: Omit<Database['public']['Tables']['quiz_questions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['quiz_questions']['Insert']>
      }

      quiz_attempts: {
        Row: {
          id:           string
          quiz_id:      string
          user_id:      string
          answers:      Json   // { question_id: selected_option }
          score:        number
          passed:       boolean
          completed_at: string
        }
        Insert: Omit<Database['public']['Tables']['quiz_attempts']['Row'], 'id' | 'completed_at'>
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Insert']>
      }

      enrollments: {
        Row: {
          id:          string
          user_id:     string
          course_id:   string
          plan_id:     string
          enrolled_at: string
          expires_at:  string | null
        }
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'enrolled_at'>
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>
      }

      lesson_progress: {
        Row: {
          id:            string
          user_id:       string
          lesson_id:     string
          completed:     boolean
          watch_seconds: number
          updated_at:    string
        }
        Insert: Omit<Database['public']['Tables']['lesson_progress']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>
      }

      placement_test_questions: {
        Row: {
          id:             string
          question_text:  string
          options:        Json
          correct_option: string
          cefr_level:     CEFRLevel
          sort_order:     number
          is_active:      boolean
        }
        Insert: Omit<Database['public']['Tables']['placement_test_questions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['placement_test_questions']['Insert']>
      }

      placement_test_results: {
        Row: {
          id:              string
          user_id:         string
          answers:         Json
          total_questions: number
          correct_answers: number
          score_by_level:  Json   // { A1: number, A2: number, ... }
          assigned_level:  CEFRLevel
          taken_at:        string
        }
        Insert: Omit<Database['public']['Tables']['placement_test_results']['Row'], 'id' | 'taken_at'>
        Update: Partial<Database['public']['Tables']['placement_test_results']['Insert']>
      }

      assignments: {
        Row: {
          id:          string
          course_id:   string
          lesson_id:   string | null
          title:       string
          description: string | null
          due_date:    string | null
          created_at:  string
        }
        Insert: Omit<Database['public']['Tables']['assignments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>
      }

      assignment_submissions: {
        Row: {
          id:            string
          assignment_id: string
          user_id:       string
          content_url:   string | null
          content_text:  string | null
          status:        AssignmentStatus
          feedback:      string | null
          grade:         number | null
          submitted_at:  string
          reviewed_at:   string | null
        }
        Insert: Omit<Database['public']['Tables']['assignment_submissions']['Row'], 'id' | 'submitted_at'>
        Update: Partial<Database['public']['Tables']['assignment_submissions']['Insert']>
      }

      payments: {
        Row: {
          id:            string
          user_id:       string
          enrollment_id: string | null
          plan_id:       string
          amount_usd:    number
          currency:      string
          provider:      string
          provider_ref:  string | null
          status:        PaymentStatus
          paid_at:       string | null
          created_at:    string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }

      certificates: {
        Row: {
          id:              string
          user_id:         string
          course_id:       string
          issued_at:       string
          certificate_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['certificates']['Row'], 'id' | 'issued_at'>
        Update: Partial<Database['public']['Tables']['certificates']['Insert']>
      }

      live_sessions: {
        Row: {
          id:           string
          course_id:    string | null
          title:        string
          meeting_url:  string
          starts_at:    string
          duration_min: number
          created_at:   string
        }
        Insert: Omit<Database['public']['Tables']['live_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['live_sessions']['Insert']>
      }
    }
  }
}