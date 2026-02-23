-- ============================================================
-- 📁 supabase/migrations/001_initial_schema.sql
-- Run with: supabase db push
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";  -- enables full-text search on courses

-- ============================================================
-- USERS
-- Extends Supabase auth.users — auto-created on signup via trigger.
-- ============================================================
create table public.users (
  id            uuid        primary key references auth.users(id) on delete cascade,
  email         text        not null,
  full_name     text,
  avatar_url    text,
  role          text        not null default 'student'
                            check (role in ('student', 'admin')),
  cefr_level    text        check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile row after signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id            uuid        primary key default uuid_generate_v4(),
  slug          text        unique not null,
  title         text        not null,
  description   text,
  thumbnail_url text,
  trailer_url   text,

  -- Categorisation (one of these groups will be non-null per row)
  category      text        not null
                            check (category in ('level', 'skill', 'academic', 'exam')),
  cefr_level    text        check (cefr_level    in ('A1', 'A2', 'B1', 'B2', 'C1')),
  skill_type    text        check (skill_type    in ('grammar', 'speaking')),
  academic_year text        check (academic_year in ('1st_secondary', '2nd_secondary', '3rd_secondary')),
  exam_type     text        check (exam_type     in ('IELTS', 'TOEFL')),

  is_published  boolean     not null default false,
  sort_order    int         not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger courses_updated_at
  before update on public.courses
  for each row execute procedure public.set_updated_at();

-- Full-text search index
create index courses_title_search on public.courses using gin (title gin_trgm_ops);

-- ============================================================
-- PLANS  (Standard / Premium per course)
-- ============================================================
create table public.plans (
  id                      uuid        primary key default uuid_generate_v4(),
  course_id               uuid        not null references public.courses(id) on delete cascade,
  name                    text        not null check (name in ('standard', 'premium')),
  price_usd               numeric(10,2) not null,

  -- Feature flags
  has_videos              boolean     not null default true,
  has_pdfs                boolean     not null default true,
  has_quizzes             boolean     not null default true,
  has_progress_tracking   boolean     not null default true,
  has_certificate         boolean     not null default true,
  has_assignments         boolean     not null default false,
  has_instructor_feedback boolean     not null default false,
  has_live_sessions       boolean     not null default false,
  has_private_group       boolean     not null default false,
  has_study_plan          boolean     not null default false,

  created_at              timestamptz not null default now(),
  unique (course_id, name)
);

-- ============================================================
-- SECTIONS
-- ============================================================
create table public.sections (
  id          uuid        primary key default uuid_generate_v4(),
  course_id   uuid        not null references public.courses(id) on delete cascade,
  title       text        not null,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- LESSONS
-- ============================================================
create table public.lessons (
  id           uuid        primary key default uuid_generate_v4(),
  section_id   uuid        not null references public.sections(id) on delete cascade,
  title        text        not null,
  description  text,
  video_url    text,
  duration_sec int,
  sort_order   int         not null default 0,
  is_preview   boolean     not null default false,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ATTACHMENTS  (PDFs / resources per lesson)
-- ============================================================
create table public.attachments (
  id          uuid        primary key default uuid_generate_v4(),
  lesson_id   uuid        not null references public.lessons(id) on delete cascade,
  name        text        not null,
  file_url    text        not null,
  file_type   text        not null default 'pdf',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- QUIZZES + QUESTIONS + ATTEMPTS
-- ============================================================
create table public.quizzes (
  id          uuid        primary key default uuid_generate_v4(),
  section_id  uuid        references public.sections(id) on delete cascade,
  title       text        not null,
  pass_score  int         not null default 70,
  created_at  timestamptz not null default now()
);

create table public.quiz_questions (
  id             uuid  primary key default uuid_generate_v4(),
  quiz_id        uuid  not null references public.quizzes(id) on delete cascade,
  question_text  text  not null,
  options        jsonb not null,        -- [{"id":"a","text":"..."},...]
  correct_option text  not null,
  explanation    text,
  sort_order     int   not null default 0
);

create table public.quiz_attempts (
  id           uuid        primary key default uuid_generate_v4(),
  quiz_id      uuid        not null references public.quizzes(id),
  user_id      uuid        not null references public.users(id),
  answers      jsonb       not null,    -- {"questionId":"selectedOption",...}
  score        int         not null,
  passed       boolean     not null,
  completed_at timestamptz not null default now()
);

-- ============================================================
-- ENROLLMENTS
-- ============================================================
create table public.enrollments (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  course_id   uuid        not null references public.courses(id) on delete cascade,
  plan_id     uuid        not null references public.plans(id),
  enrolled_at timestamptz not null default now(),
  expires_at  timestamptz,                    -- null = lifetime
  unique (user_id, course_id)
);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
create table public.lesson_progress (
  id            uuid        primary key default uuid_generate_v4(),
  user_id       uuid        not null references public.users(id) on delete cascade,
  lesson_id     uuid        not null references public.lessons(id) on delete cascade,
  completed     boolean     not null default false,
  watch_seconds int         not null default 0,
  updated_at    timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create trigger lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- PLACEMENT TEST QUESTIONS + RESULTS
-- ============================================================
create table public.placement_test_questions (
  id             uuid    primary key default uuid_generate_v4(),
  question_text  text    not null,
  options        jsonb   not null,
  correct_option text    not null,
  cefr_level     text    not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  sort_order     int     not null default 0,
  is_active      boolean not null default true
);

create table public.placement_test_results (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references public.users(id) on delete cascade,
  answers         jsonb       not null,
  total_questions int         not null,
  correct_answers int         not null,
  score_by_level  jsonb       not null,   -- {"A1":80,"A2":60,...}
  assigned_level  text        not null check (assigned_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  taken_at        timestamptz not null default now()
);

-- ============================================================
-- ASSIGNMENTS + SUBMISSIONS
-- ============================================================
create table public.assignments (
  id          uuid        primary key default uuid_generate_v4(),
  course_id   uuid        not null references public.courses(id) on delete cascade,
  lesson_id   uuid        references public.lessons(id),
  title       text        not null,
  description text,
  due_date    timestamptz,
  created_at  timestamptz not null default now()
);

create table public.assignment_submissions (
  id            uuid        primary key default uuid_generate_v4(),
  assignment_id uuid        not null references public.assignments(id) on delete cascade,
  user_id       uuid        not null references public.users(id) on delete cascade,
  content_url   text,
  content_text  text,
  status        text        not null default 'submitted'
                            check (status in ('submitted', 'reviewed')),
  feedback      text,
  grade         int         check (grade between 0 and 100),
  submitted_at  timestamptz not null default now(),
  reviewed_at   timestamptz,
  unique (assignment_id, user_id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table public.payments (
  id            uuid           primary key default uuid_generate_v4(),
  user_id       uuid           not null references public.users(id),
  enrollment_id uuid           references public.enrollments(id),
  plan_id       uuid           not null references public.plans(id),
  amount_usd    numeric(10, 2) not null,
  currency      text           not null default 'USD',
  provider      text           not null,       -- 'stripe' | 'paypal'
  provider_ref  text,                          -- Stripe PaymentIntent ID
  status        text           not null default 'pending'
                               check (status in ('pending', 'completed', 'refunded', 'failed')),
  paid_at       timestamptz,
  created_at    timestamptz    not null default now()
);

-- ============================================================
-- CERTIFICATES
-- ============================================================
create table public.certificates (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references public.users(id),
  course_id       uuid        not null references public.courses(id),
  issued_at       timestamptz not null default now(),
  certificate_url text,
  unique (user_id, course_id)
);

-- ============================================================
-- LIVE SESSIONS
-- ============================================================
create table public.live_sessions (
  id           uuid        primary key default uuid_generate_v4(),
  course_id    uuid        references public.courses(id),
  title        text        not null,
  meeting_url  text        not null,
  starts_at    timestamptz not null,
  duration_min int         not null default 60,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================

-- Users
alter table public.users enable row level security;
create policy "users: read own row"   on public.users for select using (auth.uid() = id);
create policy "users: update own row" on public.users for update using (auth.uid() = id);
create policy "admin: read all users" on public.users for select
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Courses (public read for published, admin write)
alter table public.courses enable row level security;
create policy "courses: public read published" on public.courses for select using (is_published = true);
create policy "courses: admin all"             on public.courses
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Plans (readable by everyone, writable by admin)
alter table public.plans enable row level security;
create policy "plans: public read"  on public.plans for select using (true);
create policy "plans: admin write"  on public.plans
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Sections + Lessons + Attachments (readable if course is published)
alter table public.sections    enable row level security;
alter table public.lessons     enable row level security;
alter table public.attachments enable row level security;

create policy "sections: read if course published" on public.sections for select
  using (exists (select 1 from public.courses c where c.id = course_id and c.is_published));
create policy "lessons: read if section accessible" on public.lessons for select
  using (exists (select 1 from public.sections s join public.courses c on c.id = s.course_id
                 where s.id = section_id and c.is_published));
create policy "attachments: read if enrolled" on public.attachments for select
  using (exists (
    select 1 from public.lessons l
    join public.sections s on s.id = l.section_id
    join public.enrollments e on e.course_id = s.course_id
    where l.id = lesson_id and e.user_id = auth.uid()
  ));

-- Admin write for sections, lessons, attachments
create policy "sections: admin write"    on public.sections    using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "lessons: admin write"     on public.lessons     using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "attachments: admin write" on public.attachments using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Quizzes
alter table public.quizzes        enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts  enable row level security;
create policy "quizzes: read if enrolled"  on public.quizzes        for select using (true);
create policy "questions: read if enrolled" on public.quiz_questions for select using (true);
create policy "attempts: own rows"          on public.quiz_attempts  using (auth.uid() = user_id);
create policy "quizzes: admin write"        on public.quizzes        using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "questions: admin write"      on public.quiz_questions using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Enrollments
alter table public.enrollments enable row level security;
create policy "enrollments: own or admin" on public.enrollments
  using (auth.uid() = user_id or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Lesson progress
alter table public.lesson_progress enable row level security;
create policy "progress: own rows" on public.lesson_progress using (auth.uid() = user_id);

-- Placement
alter table public.placement_test_questions enable row level security;
alter table public.placement_test_results   enable row level security;
create policy "pt_questions: authenticated read" on public.placement_test_questions for select using (auth.role() = 'authenticated');
create policy "pt_results: own rows"             on public.placement_test_results   using (auth.uid() = user_id);
create policy "pt_questions: admin write"        on public.placement_test_questions using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Assignments
alter table public.assignments            enable row level security;
alter table public.assignment_submissions enable row level security;
create policy "assignments: enrolled read"   on public.assignments
  for select using (exists (select 1 from public.enrollments e where e.course_id = course_id and e.user_id = auth.uid()));
create policy "submissions: own rows"        on public.assignment_submissions using (auth.uid() = user_id);
create policy "assignments: admin write"     on public.assignments            using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "submissions: admin read"      on public.assignment_submissions for select
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- Payments + Certificates + Live Sessions
alter table public.payments       enable row level security;
alter table public.certificates   enable row level security;
alter table public.live_sessions  enable row level security;
create policy "payments: own rows"         on public.payments      using (auth.uid() = user_id);
create policy "certificates: own rows"     on public.certificates  using (auth.uid() = user_id);
create policy "live_sessions: auth read"   on public.live_sessions for select using (auth.role() = 'authenticated');
create policy "live_sessions: admin write" on public.live_sessions using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));