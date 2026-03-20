-- ============================================================
-- 005_missing_features.sql
-- Adds levels, materials, subscriptions tables and seeds levels.
-- ============================================================

BEGIN;

-- ============================================================
-- LEVELS
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

-- Seed default levels
INSERT INTO public.levels (name, slug, sort_order) VALUES
  ('Beginner',         'beginner',          1),
  ('Elementary',       'elementary',        2),
  ('Pre-Intermediate', 'pre-intermediate',  3),
  ('Intermediate',     'intermediate',      4),
  ('Advanced',         'advanced',          5);

-- Add level_id FK to users, courses, groups
ALTER TABLE public.users   ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;
ALTER TABLE public.groups  ADD COLUMN IF NOT EXISTS level_id uuid REFERENCES public.levels(id) ON DELETE SET NULL;

-- ============================================================
-- MATERIALS
-- ============================================================
CREATE TABLE public.materials (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id   uuid        REFERENCES public.courses(id) ON DELETE SET NULL,
  lesson_id   uuid        REFERENCES public.lessons(id) ON DELETE SET NULL,
  title       text        NOT NULL,
  type        text        NOT NULL DEFAULT 'pdf'
                          CHECK (type IN ('pdf', 'video', 'worksheet', 'vocabulary')),
  file_url    text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE public.subscriptions (
  id          uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id     uuid        NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  status      text        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at   timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz,
  auto_renew  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.levels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Levels: public read, owner write
CREATE POLICY "levels: public read" ON public.levels FOR SELECT USING (true);
CREATE POLICY "levels: owner write" ON public.levels
  FOR ALL USING (public.get_my_role() = 'owner');

-- Materials: owner/teacher write, enrolled students read
CREATE POLICY "materials: owner all" ON public.materials
  FOR ALL USING (public.get_my_role() = 'owner');
CREATE POLICY "materials: teacher manage own" ON public.materials
  FOR ALL USING (teacher_id = auth.uid() AND public.get_my_role() = 'teacher');
CREATE POLICY "materials: student read enrolled" ON public.materials
  FOR SELECT USING (
    course_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = materials.course_id AND e.user_id = auth.uid()
    )
  );

-- Subscriptions: own rows + owner all
CREATE POLICY "subscriptions: own rows" ON public.subscriptions
  USING (user_id = auth.uid());
CREATE POLICY "subscriptions: owner all" ON public.subscriptions
  FOR ALL USING (public.get_my_role() = 'owner');

COMMIT;
