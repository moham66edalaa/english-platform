-- ============================================================
-- ELOQUENCE PLATFORM — FULL DATABASE SCHEMA
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE public.users (
  id            uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text        NOT NULL,
  full_name     text,
  avatar_url    text,
  role          text        NOT NULL DEFAULT 'student'
                            CHECK (role IN ('student', 'teacher', 'admin')),
  cefr_level    text        CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  phone         text,
  parent_name   text,
  bio           text,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN new.updated_at = now(); RETURN new; END;
$$;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Helper: get current user role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE public.courses (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          text        UNIQUE NOT NULL,
  title         text        NOT NULL,
  description   text,
  thumbnail_url text,
  trailer_url   text,
  category      text        NOT NULL CHECK (category IN ('level', 'skill', 'academic', 'exam')),
  cefr_level    text        CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  skill_type    text        CHECK (skill_type IN ('grammar', 'speaking')),
  academic_year text        CHECK (academic_year IN ('1st_secondary', '2nd_secondary', '3rd_secondary')),
  exam_type     text        CHECK (exam_type IN ('IELTS', 'TOEFL')),
  is_published  boolean     NOT NULL DEFAULT false,
  sort_order    int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE INDEX courses_title_search ON public.courses USING gin (title gin_trgm_ops);

-- ============================================================
-- PLANS
-- ============================================================
CREATE TABLE public.plans (
  id                      uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id               uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name                    text        NOT NULL CHECK (name IN ('standard', 'premium')),
  price_usd               numeric(10,2) NOT NULL,
  has_videos              boolean     NOT NULL DEFAULT true,
  has_pdfs                boolean     NOT NULL DEFAULT true,
  has_quizzes             boolean     NOT NULL DEFAULT true,
  has_progress_tracking   boolean     NOT NULL DEFAULT true,
  has_certificate         boolean     NOT NULL DEFAULT true,
  has_assignments         boolean     NOT NULL DEFAULT false,
  has_instructor_feedback boolean     NOT NULL DEFAULT false,
  has_live_sessions       boolean     NOT NULL DEFAULT false,
  has_private_group       boolean     NOT NULL DEFAULT false,
  has_study_plan          boolean     NOT NULL DEFAULT false,
  created_at              timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, name)
);

-- ============================================================
-- SECTIONS + LESSONS + ATTACHMENTS
-- ============================================================
CREATE TABLE public.sections (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id  uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title      text        NOT NULL,
  sort_order int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.lessons (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id   uuid        NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  description  text,
  video_url    text,
  duration_sec int,
  sort_order   int         NOT NULL DEFAULT 0,
  is_preview   boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.attachments (
  id        uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id uuid        NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  name      text        NOT NULL,
  file_url  text        NOT NULL,
  file_type text        NOT NULL DEFAULT 'pdf',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- QUIZZES + QUESTIONS + ATTEMPTS
-- ============================================================
CREATE TABLE public.quizzes (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id uuid        REFERENCES public.sections(id) ON DELETE CASCADE,
  title      text        NOT NULL,
  pass_score int         NOT NULL DEFAULT 70,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_questions (
  id             uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id        uuid  NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text  text  NOT NULL,
  options        jsonb NOT NULL,
  correct_option text  NOT NULL,
  explanation    text,
  sort_order     int   NOT NULL DEFAULT 0
);

CREATE TABLE public.quiz_attempts (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id      uuid        NOT NULL REFERENCES public.quizzes(id),
  user_id      uuid        NOT NULL REFERENCES public.users(id),
  answers      jsonb       NOT NULL,
  score        int         NOT NULL,
  passed       boolean     NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ENROLLMENTS + LESSON PROGRESS
-- ============================================================
CREATE TABLE public.enrollments (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  plan_id     uuid        NOT NULL REFERENCES public.plans(id),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz,
  UNIQUE (user_id, course_id)
);

CREATE TABLE public.lesson_progress (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id     uuid        NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed     boolean     NOT NULL DEFAULT false,
  watch_seconds int         NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

CREATE TRIGGER lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ============================================================
-- PLACEMENT TEST
-- ============================================================
CREATE TABLE public.placement_test_questions (
  id             uuid    PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text  text    NOT NULL,
  options        jsonb   NOT NULL,
  correct_option text    NOT NULL,
  cefr_level     text    NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  sort_order     int     NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true
);

CREATE TABLE public.placement_test_results (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  answers         jsonb       NOT NULL,
  total_questions int         NOT NULL,
  correct_answers int         NOT NULL,
  score_by_level  jsonb       NOT NULL,
  assigned_level  text        NOT NULL CHECK (assigned_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  taken_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ASSIGNMENTS + SUBMISSIONS
-- ============================================================
CREATE TABLE public.assignments (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id   uuid        REFERENCES public.lessons(id),
  title       text        NOT NULL,
  description text,
  due_date    timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.assignment_submissions (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id uuid        NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id       uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_url   text,
  content_text  text,
  status        text        NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed')),
  feedback      text,
  grade         int         CHECK (grade BETWEEN 0 AND 100),
  submitted_at  timestamptz NOT NULL DEFAULT now(),
  reviewed_at   timestamptz,
  UNIQUE (assignment_id, user_id)
);

-- ============================================================
-- PAYMENTS + CERTIFICATES + LIVE SESSIONS
-- ============================================================
CREATE TABLE public.payments (
  id            uuid           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       uuid           NOT NULL REFERENCES public.users(id),
  enrollment_id uuid           REFERENCES public.enrollments(id),
  plan_id       uuid           NOT NULL REFERENCES public.plans(id),
  amount_usd    numeric(10,2)  NOT NULL,
  currency      text           NOT NULL DEFAULT 'USD',
  provider      text           NOT NULL,
  provider_ref  text,
  status        text           NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  paid_at       timestamptz,
  created_at    timestamptz    NOT NULL DEFAULT now()
);

CREATE TABLE public.certificates (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         uuid        NOT NULL REFERENCES public.users(id),
  course_id       uuid        NOT NULL REFERENCES public.courses(id),
  issued_at       timestamptz NOT NULL DEFAULT now(),
  certificate_url text,
  UNIQUE (user_id, course_id)
);

CREATE TABLE public.live_sessions (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id    uuid        REFERENCES public.courses(id),
  title        text        NOT NULL,
  meeting_url  text        NOT NULL,
  starts_at    timestamptz NOT NULL,
  duration_min int         NOT NULL DEFAULT 60,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- GROUPS + MEMBERS + TEACHER COURSES
-- ============================================================
CREATE TABLE public.groups (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text        NOT NULL,
  course_id     uuid        REFERENCES public.courses(id) ON DELETE SET NULL,
  teacher_id    uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  max_students  int         DEFAULT 30,
  schedule_note text,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.group_members (
  id        uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id  uuid        NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id   uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE public.teacher_courses (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, course_id)
);

-- ============================================================
-- ATTENDANCE + ANNOUNCEMENTS + SCHEDULED SESSIONS
-- ============================================================
CREATE TABLE public.attendance (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id     uuid        NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_date date        NOT NULL DEFAULT CURRENT_DATE,
  status       text        NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes        text,
  recorded_by  uuid        REFERENCES public.users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id, session_date)
);

CREATE TABLE public.announcements (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title           text        NOT NULL,
  body            text        NOT NULL,
  target_role     text        CHECK (target_role IN ('all', 'student', 'teacher')),
  target_group_id uuid        REFERENCES public.groups(id) ON DELETE CASCADE,
  is_pinned       boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.scheduled_sessions (
  id            uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id      uuid        REFERENCES public.groups(id) ON DELETE CASCADE,
  teacher_id    uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title         text        NOT NULL,
  day_of_week   int         CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    time        NOT NULL,
  end_time      time        NOT NULL,
  meeting_url   text,
  is_recurring  boolean     NOT NULL DEFAULT true,
  specific_date date,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.platform_settings (
  id         uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        text  NOT NULL UNIQUE,
  value      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- LEVELS + MATERIALS + SUBSCRIPTIONS
-- ============================================================
CREATE TABLE public.levels (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text        NOT NULL UNIQUE,
  slug        text        NOT NULL UNIQUE,
  description text,
  sort_order  int         NOT NULL DEFAULT 0,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.levels (name, slug, sort_order) VALUES
  ('Beginner',         'beginner',          1),
  ('Elementary',       'elementary',        2),
  ('Pre-Intermediate', 'pre-intermediate',  3),
  ('Intermediate',     'intermediate',      4),
  ('Advanced',         'advanced',          5);

ALTER TABLE public.users   ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;
ALTER TABLE public.groups  ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;

CREATE TABLE public.materials (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   uuid        REFERENCES public.courses(id) ON DELETE SET NULL,
  lesson_id   uuid        REFERENCES public.lessons(id) ON DELETE SET NULL,
  title       text        NOT NULL,
  type        text        NOT NULL DEFAULT 'pdf' CHECK (type IN ('pdf', 'video', 'worksheet', 'vocabulary')),
  file_url    text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subscriptions (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id     uuid        NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  status      text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at   timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz,
  auto_renew  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================

-- USERS
CREATE POLICY "users: read own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users: update own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin: read all users" ON public.users FOR SELECT USING (public.get_my_role() = 'admin' OR id = auth.uid());

-- COURSES
CREATE POLICY "courses: public read published" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "courses: admin_teacher all" ON public.courses FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- PLANS
CREATE POLICY "plans: public read" ON public.plans FOR SELECT USING (true);
CREATE POLICY "plans: admin_teacher write" ON public.plans FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- SECTIONS
CREATE POLICY "sections: read published" ON public.sections FOR SELECT USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published));
CREATE POLICY "sections: admin_teacher write" ON public.sections FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- LESSONS
CREATE POLICY "lessons: read published" ON public.lessons FOR SELECT USING (EXISTS (SELECT 1 FROM public.sections s JOIN public.courses c ON c.id = s.course_id WHERE s.id = section_id AND c.is_published));
CREATE POLICY "lessons: admin_teacher write" ON public.lessons FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- ATTACHMENTS
CREATE POLICY "attachments: read enrolled" ON public.attachments FOR SELECT USING (EXISTS (SELECT 1 FROM public.lessons l JOIN public.sections s ON s.id = l.section_id JOIN public.enrollments e ON e.course_id = s.course_id WHERE l.id = lesson_id AND e.user_id = auth.uid()));
CREATE POLICY "attachments: admin_teacher write" ON public.attachments FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- QUIZZES
CREATE POLICY "quizzes: public read" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "quizzes: admin_teacher write" ON public.quizzes FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- QUIZ QUESTIONS
CREATE POLICY "quiz_questions: public read" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "quiz_questions: admin_teacher write" ON public.quiz_questions FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- QUIZ ATTEMPTS
CREATE POLICY "quiz_attempts: own rows" ON public.quiz_attempts USING (auth.uid() = user_id);

-- ENROLLMENTS
CREATE POLICY "enrollments: own or admin" ON public.enrollments USING (auth.uid() = user_id OR public.get_my_role() = 'admin');

-- LESSON PROGRESS
CREATE POLICY "lesson_progress: own rows" ON public.lesson_progress USING (auth.uid() = user_id);

-- PLACEMENT TEST
CREATE POLICY "pt_questions: auth read" ON public.placement_test_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "pt_questions: admin write" ON public.placement_test_questions FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "pt_results: own rows" ON public.placement_test_results USING (auth.uid() = user_id);

-- ASSIGNMENTS
CREATE POLICY "assignments: enrolled read" ON public.assignments FOR SELECT USING (EXISTS (SELECT 1 FROM public.enrollments e WHERE e.course_id = course_id AND e.user_id = auth.uid()));
CREATE POLICY "assignments: admin_teacher write" ON public.assignments FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- ASSIGNMENT SUBMISSIONS
CREATE POLICY "submissions: own rows" ON public.assignment_submissions USING (auth.uid() = user_id);
CREATE POLICY "submissions: admin_teacher read" ON public.assignment_submissions FOR SELECT USING (public.get_my_role() IN ('admin', 'teacher') OR user_id = auth.uid());

-- PAYMENTS
CREATE POLICY "payments: own rows" ON public.payments USING (auth.uid() = user_id);

-- CERTIFICATES
CREATE POLICY "certificates: own rows" ON public.certificates USING (auth.uid() = user_id);

-- LIVE SESSIONS
CREATE POLICY "live_sessions: auth read" ON public.live_sessions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "live_sessions: admin_teacher write" ON public.live_sessions FOR ALL USING (public.get_my_role() IN ('admin', 'teacher'));

-- GROUPS
CREATE POLICY "groups: admin all" ON public.groups FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "groups: teacher read own" ON public.groups FOR SELECT USING (teacher_id = auth.uid() OR public.get_my_role() = 'admin');
CREATE POLICY "groups: student read own" ON public.groups FOR SELECT USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid()));

-- GROUP MEMBERS
CREATE POLICY "group_members: admin all" ON public.group_members FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "group_members: teacher read own" ON public.group_members FOR SELECT USING (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid()) OR public.get_my_role() = 'admin');
CREATE POLICY "group_members: student read own" ON public.group_members FOR SELECT USING (user_id = auth.uid());

-- TEACHER COURSES
CREATE POLICY "teacher_courses: admin all" ON public.teacher_courses FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "teacher_courses: teacher read own" ON public.teacher_courses FOR SELECT USING (teacher_id = auth.uid() OR public.get_my_role() IN ('admin', 'teacher'));

-- ATTENDANCE
CREATE POLICY "attendance: admin all" ON public.attendance FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "attendance: teacher manage own" ON public.attendance FOR ALL USING (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid()) OR public.get_my_role() = 'admin');
CREATE POLICY "attendance: student read own" ON public.attendance FOR SELECT USING (user_id = auth.uid());

-- ANNOUNCEMENTS
CREATE POLICY "announcements: admin all" ON public.announcements FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "announcements: teacher manage own" ON public.announcements FOR ALL USING (author_id = auth.uid() AND public.get_my_role() = 'teacher');
CREATE POLICY "announcements: read visible" ON public.announcements FOR SELECT USING (target_role = 'all' OR author_id = auth.uid() OR public.get_my_role() = 'admin' OR (target_group_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = target_group_id AND gm.user_id = auth.uid())));

-- SCHEDULED SESSIONS
CREATE POLICY "scheduled_sessions: admin all" ON public.scheduled_sessions FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "scheduled_sessions: teacher manage own" ON public.scheduled_sessions FOR ALL USING (teacher_id = auth.uid() OR public.get_my_role() = 'admin');
CREATE POLICY "scheduled_sessions: student read own" ON public.scheduled_sessions FOR SELECT USING (group_id IS NULL OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = scheduled_sessions.group_id AND gm.user_id = auth.uid()) OR public.get_my_role() IN ('admin', 'teacher'));

-- PLATFORM SETTINGS
CREATE POLICY "platform_settings: admin all" ON public.platform_settings FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "platform_settings: public read" ON public.platform_settings FOR SELECT USING (true);

-- LEVELS
CREATE POLICY "levels: public read" ON public.levels FOR SELECT USING (true);
CREATE POLICY "levels: admin write" ON public.levels FOR ALL USING (public.get_my_role() = 'admin');

-- MATERIALS
CREATE POLICY "materials: admin all" ON public.materials FOR ALL USING (public.get_my_role() = 'admin');
CREATE POLICY "materials: teacher manage own" ON public.materials FOR ALL USING (teacher_id = auth.uid() AND public.get_my_role() = 'teacher');
CREATE POLICY "materials: student read enrolled" ON public.materials FOR SELECT USING (course_id IS NULL OR EXISTS (SELECT 1 FROM public.enrollments e WHERE e.course_id = materials.course_id AND e.user_id = auth.uid()));

-- SUBSCRIPTIONS
CREATE POLICY "subscriptions: own rows" ON public.subscriptions USING (user_id = auth.uid());
CREATE POLICY "subscriptions: admin all" ON public.subscriptions FOR ALL USING (public.get_my_role() = 'admin');
