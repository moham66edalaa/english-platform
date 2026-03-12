-- ============================================================
-- 004_full_dashboards.sql
-- New tables for groups, attendance, teacher-course mapping,
-- announcements, scheduled sessions, and platform settings.
-- ============================================================

BEGIN;

-- ============================================================
-- 1. CREATE ALL TABLES FIRST (no RLS yet)
-- ============================================================

-- GROUPS
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

-- GROUP MEMBERS
CREATE TABLE public.group_members (
  id         uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id   uuid        NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- TEACHER-COURSE MAPPING
CREATE TABLE public.teacher_courses (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   uuid        NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, course_id)
);

-- ATTENDANCE
CREATE TABLE public.attendance (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id     uuid        NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id      uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_date date        NOT NULL DEFAULT CURRENT_DATE,
  status       text        NOT NULL DEFAULT 'present'
                           CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes        text,
  recorded_by  uuid        REFERENCES public.users(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id, session_date)
);

-- ANNOUNCEMENTS
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

-- SCHEDULED SESSIONS
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

-- PLATFORM SETTINGS
CREATE TABLE public.platform_settings (
  id         uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        text  NOT NULL UNIQUE,
  value      text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. ADD COLUMNS TO USERS
-- ============================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS parent_name text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- ============================================================
-- 3. ENABLE RLS ON ALL NEW TABLES
-- ============================================================
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS POLICIES (all tables exist now, safe to cross-reference)
-- ============================================================

-- GROUPS policies
CREATE POLICY "groups: owner all" ON public.groups
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "groups: teacher read own" ON public.groups
  FOR SELECT USING (teacher_id = auth.uid() OR public.get_my_role() = 'owner');

CREATE POLICY "groups: student read own" ON public.groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid())
  );

-- GROUP MEMBERS policies
CREATE POLICY "group_members: owner all" ON public.group_members
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "group_members: teacher read own groups" ON public.group_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
    OR public.get_my_role() = 'owner'
  );

CREATE POLICY "group_members: student read own" ON public.group_members
  FOR SELECT USING (user_id = auth.uid());

-- TEACHER COURSES policies
CREATE POLICY "teacher_courses: owner all" ON public.teacher_courses
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "teacher_courses: teacher read own" ON public.teacher_courses
  FOR SELECT USING (teacher_id = auth.uid() OR public.get_my_role() IN ('owner', 'teacher'));

-- ATTENDANCE policies
CREATE POLICY "attendance: owner all" ON public.attendance
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "attendance: teacher manage own groups" ON public.attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.teacher_id = auth.uid())
    OR public.get_my_role() = 'owner'
  );

CREATE POLICY "attendance: student read own" ON public.attendance
  FOR SELECT USING (user_id = auth.uid());

-- ANNOUNCEMENTS policies
CREATE POLICY "announcements: owner all" ON public.announcements
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "announcements: teacher manage own" ON public.announcements
  FOR ALL USING (author_id = auth.uid() AND public.get_my_role() = 'teacher');

CREATE POLICY "announcements: read visible" ON public.announcements
  FOR SELECT USING (
    target_role = 'all'
    OR target_role = (SELECT role FROM public.users WHERE id = auth.uid())
    OR (target_group_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.group_members gm WHERE gm.group_id = target_group_id AND gm.user_id = auth.uid()
    ))
    OR author_id = auth.uid()
    OR public.get_my_role() = 'owner'
  );

-- SCHEDULED SESSIONS policies
CREATE POLICY "scheduled_sessions: owner all" ON public.scheduled_sessions
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "scheduled_sessions: teacher manage own" ON public.scheduled_sessions
  FOR ALL USING (teacher_id = auth.uid() OR public.get_my_role() = 'owner');

CREATE POLICY "scheduled_sessions: student read own groups" ON public.scheduled_sessions
  FOR SELECT USING (
    group_id IS NULL
    OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = scheduled_sessions.group_id AND gm.user_id = auth.uid())
    OR public.get_my_role() IN ('owner', 'teacher')
  );

-- PLATFORM SETTINGS policies
CREATE POLICY "platform_settings: owner all" ON public.platform_settings
  FOR ALL USING (public.get_my_role() = 'owner');

CREATE POLICY "platform_settings: public read" ON public.platform_settings
  FOR SELECT USING (true);

COMMIT;
