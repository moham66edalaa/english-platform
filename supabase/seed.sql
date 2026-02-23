-- ============================================================
-- 📁 supabase/seed.sql
-- Development seed data. Run with: supabase db reset  (runs migrations then seed)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Admin user  (create via Supabase dashboard, then set role)
-- ────────────────────────────────────────────────────────────
-- NOTE: Auth users must be created via supabase.auth.signUp() or the dashboard.
-- After creating the instructor account, run this to promote it:
--
-- update public.users set role = 'admin' where email = 'instructor@eloquence.com';

-- ────────────────────────────────────────────────────────────
-- 2. Level-based courses (A1–C1)
-- ────────────────────────────────────────────────────────────
insert into public.courses (slug, title, description, category, cefr_level, is_published, sort_order) values
  ('a1-beginner',          'A1 Beginner English',           'Build your first English foundations: the alphabet, basic vocabulary, numbers, colours, and simple everyday sentences.',                'level', 'A1', true, 1),
  ('a2-elementary',        'A2 Elementary English',          'Communicate in everyday situations — introduce yourself, describe your environment, and handle simple transactions.',                   'level', 'A2', true, 2),
  ('b1-intermediate',      'B1 Intermediate English',        'Handle most travel situations, write simple connected texts, and describe experiences and events.',                                     'level', 'B1', true, 3),
  ('b2-upper-intermediate','B2 Upper-Intermediate English',  'Understand the main ideas of complex text, interact fluently with native speakers, and produce detailed writing.',                      'level', 'B2', true, 4),
  ('c1-advanced',          'C1 Advanced English',            'Express yourself fluently and spontaneously on complex topics with precise, well-organised language.',                                   'level', 'C1', true, 5);

-- ────────────────────────────────────────────────────────────
-- 3. Skill-based courses
-- ────────────────────────────────────────────────────────────
insert into public.courses (slug, title, description, category, skill_type, is_published, sort_order) values
  ('grammar-mastery',     'Grammar Mastery',      'Deep-dive into English grammar: articles, tenses, conditionals, reported speech, and complex clause structures.', 'skill', 'grammar',  true, 10),
  ('speaking-confidence', 'Speaking Confidence',  'Develop fluency, pronunciation, intonation, and the ability to think — not translate — in English.',              'skill', 'speaking', true, 11);

-- ────────────────────────────────────────────────────────────
-- 4. Academic courses
-- ────────────────────────────────────────────────────────────
insert into public.courses (slug, title, description, category, academic_year, is_published, sort_order) values
  ('1st-secondary', '1st Secondary English', 'Full national curriculum for Year 1 secondary students, with grammar, reading, and writing components.',          'academic', '1st_secondary', true, 20),
  ('2nd-secondary', '2nd Secondary English', 'Second-year curriculum with advanced grammar, essay writing, and comprehension practice.',                         'academic', '2nd_secondary', true, 21),
  ('3rd-secondary', '3rd Secondary English', 'Final-year exam preparation with past papers, marking schemes, and exam strategy sessions.',                       'academic', '3rd_secondary', true, 22);

-- ────────────────────────────────────────────────────────────
-- 5. International exam courses
-- ────────────────────────────────────────────────────────────
insert into public.courses (slug, title, description, category, exam_type, is_published, sort_order) values
  ('ielts-preparation', 'IELTS Preparation',  'Full IELTS iBT preparation targeting Band 6–8. Covers Reading, Writing, Listening, and Speaking with timed practice tests.', 'exam', 'IELTS', true, 30),
  ('toefl-preparation', 'TOEFL Preparation',  'Comprehensive TOEFL iBT course including integrated tasks, academic reading passages, and full practice tests.',              'exam', 'TOEFL', true, 31);

-- ────────────────────────────────────────────────────────────
-- 6. Plans for every course  (Standard + Premium)
-- ────────────────────────────────────────────────────────────
insert into public.plans (course_id, name, price_usd, has_assignments, has_instructor_feedback, has_live_sessions, has_private_group, has_study_plan)
select id, 'standard', 49, false, false, false, false, false from public.courses where cefr_level in ('A1','A2') union all
select id, 'premium',  99, true,  true,  true,  true,  true  from public.courses where cefr_level in ('A1','A2') union all
select id, 'standard', 59, false, false, false, false, false from public.courses where cefr_level = 'B1'         union all
select id, 'premium',  99, true,  true,  true,  true,  true  from public.courses where cefr_level = 'B1'         union all
select id, 'standard', 69, false, false, false, false, false from public.courses where cefr_level = 'B2'         union all
select id, 'premium',  99, true,  true,  true,  true,  true  from public.courses where cefr_level = 'B2'         union all
select id, 'standard', 79, false, false, false, false, false from public.courses where cefr_level = 'C1'         union all
select id, 'premium',  99, true,  true,  true,  true,  true  from public.courses where cefr_level = 'C1'         union all
select id, 'standard', 59, false, false, false, false, false from public.courses where skill_type  is not null   union all
select id, 'premium',  99, true,  true,  true,  true,  true  from public.courses where skill_type  is not null   union all
select id, 'standard', 49, false, false, false, false, false from public.courses where academic_year is not null union all
select id, 'premium',  79, true,  true,  true,  true,  true  from public.courses where academic_year is not null union all
select id, 'standard', 89, false, false, false, false, false from public.courses where exam_type   is not null   union all
select id, 'premium',  149,true,  true,  true,  true,  true  from public.courses where exam_type   is not null;

-- ────────────────────────────────────────────────────────────
-- 7. Sample sections + lessons for A1 Beginner
-- ────────────────────────────────────────────────────────────
do $$
declare
  v_course_id uuid;
  v_section_1 uuid;
  v_section_2 uuid;
  v_section_3 uuid;
begin
  select id into v_course_id from public.courses where slug = 'a1-beginner';

  -- Section 1
  insert into public.sections (id, course_id, title, sort_order) values
    (uuid_generate_v4(), v_course_id, 'Getting Started: The Alphabet & Numbers', 1)
  returning id into v_section_1;

  insert into public.lessons (section_id, title, description, duration_sec, sort_order, is_preview) values
    (v_section_1, 'The English Alphabet', 'Learn all 26 letters with correct pronunciation.', 720,  1, true),
    (v_section_1, 'Numbers 1–100',        'Count and say numbers in English.',                 900,  2, false),
    (v_section_1, 'Days & Months',        'Learn the days of the week and months of the year.',600, 3, false);

  -- Section 1 quiz
  insert into public.quizzes (section_id, title, pass_score) values
    (v_section_1, 'Quiz: Alphabet & Numbers', 70);

  -- Section 2
  insert into public.sections (id, course_id, title, sort_order) values
    (uuid_generate_v4(), v_course_id, 'Introducing Yourself', 2)
  returning id into v_section_2;

  insert into public.lessons (section_id, title, description, duration_sec, sort_order, is_preview) values
    (v_section_2, 'Hello! My name is…',   'Basic greetings and self-introduction.',           840,  1, false),
    (v_section_2, 'Where are you from?',  'Countries, nationalities, and the verb "to be".',  960,  2, false),
    (v_section_2, 'How old are you?',     'Age, family members, and simple questions.',        780,  3, false);

  insert into public.quizzes (section_id, title, pass_score) values
    (v_section_2, 'Quiz: Self-Introduction', 70);

  -- Section 3
  insert into public.sections (id, course_id, title, sort_order) values
    (uuid_generate_v4(), v_course_id, 'Everyday Vocabulary', 3)
  returning id into v_section_3;

  insert into public.lessons (section_id, title, description, duration_sec, sort_order, is_preview) values
    (v_section_3, 'Colours & Shapes',     'Learn common colours and shapes.',                  540,  1, false),
    (v_section_3, 'Food & Drink',         'Vocabulary for ordering food and drinks.',           720,  2, false),
    (v_section_3, 'At the Supermarket',   'Prices, quantities, and shopping expressions.',      840,  3, false);

  insert into public.quizzes (section_id, title, pass_score) values
    (v_section_3, 'Quiz: Everyday Vocabulary', 70);
end;
$$;

-- ────────────────────────────────────────────────────────────
-- 8. Sample placement test questions (6 per level = 30 total)
-- ────────────────────────────────────────────────────────────
insert into public.placement_test_questions (question_text, options, correct_option, cefr_level, sort_order) values
-- A1
('What is the plural of "child"?',
 '[{"id":"a","text":"childs"},{"id":"b","text":"children"},{"id":"c","text":"childes"},{"id":"d","text":"childre"}]',
 'b', 'A1', 1),
('Choose the correct verb: "She ___ a doctor."',
 '[{"id":"a","text":"am"},{"id":"b","text":"are"},{"id":"c","text":"is"},{"id":"d","text":"be"}]',
 'c', 'A1', 2),
('What is the opposite of "hot"?',
 '[{"id":"a","text":"warm"},{"id":"b","text":"cold"},{"id":"c","text":"big"},{"id":"d","text":"fast"}]',
 'b', 'A1', 3),
('"I ___ from Egypt." — which word fits?',
 '[{"id":"a","text":"is"},{"id":"b","text":"are"},{"id":"c","text":"am"},{"id":"d","text":"be"}]',
 'c', 'A1', 4),
('Which sentence is correct?',
 '[{"id":"a","text":"She have a car."},{"id":"b","text":"She has a car."},{"id":"c","text":"She haves a car."},{"id":"d","text":"She having a car."}]',
 'b', 'A1', 5),
('What time is "3:00"?',
 '[{"id":"a","text":"Three past"},{"id":"b","text":"Three o''clock"},{"id":"c","text":"At three"},{"id":"d","text":"Three times"}]',
 'b', 'A1', 6),

-- A2
('Choose the correct past form: "Yesterday I ___ to school."',
 '[{"id":"a","text":"go"},{"id":"b","text":"goes"},{"id":"c","text":"went"},{"id":"d","text":"gone"}]',
 'c', 'A2', 7),
('"There ___ some milk in the fridge." — correct option?',
 '[{"id":"a","text":"are"},{"id":"b","text":"is"},{"id":"c","text":"were"},{"id":"d","text":"have"}]',
 'b', 'A2', 8),
('Which is a comparative adjective?',
 '[{"id":"a","text":"tallest"},{"id":"b","text":"taller"},{"id":"c","text":"tall"},{"id":"d","text":"tallly"}]',
 'b', 'A2', 9),
('Complete: "I have lived here ___ 2018."',
 '[{"id":"a","text":"for"},{"id":"b","text":"since"},{"id":"c","text":"from"},{"id":"d","text":"during"}]',
 'b', 'A2', 10),
('Which word means "very big"?',
 '[{"id":"a","text":"tiny"},{"id":"b","text":"huge"},{"id":"c","text":"narrow"},{"id":"d","text":"shallow"}]',
 'b', 'A2', 11),
('"___ you ever been to London?" — correct form?',
 '[{"id":"a","text":"Do"},{"id":"b","text":"Did"},{"id":"c","text":"Have"},{"id":"d","text":"Are"}]',
 'c', 'A2', 12),

-- B1
('Choose the correct form: "If I had more time, I ___ learn piano."',
 '[{"id":"a","text":"will"},{"id":"b","text":"would"},{"id":"c","text":"should"},{"id":"d","text":"could have"}]',
 'b', 'B1', 13),
('"The report ___ by Friday." — passive voice.',
 '[{"id":"a","text":"will finish"},{"id":"b","text":"will be finished"},{"id":"c","text":"finishes"},{"id":"d","text":"has finished"}]',
 'b', 'B1', 14),
('What does "nevertheless" mean?',
 '[{"id":"a","text":"as a result"},{"id":"b","text":"in addition"},{"id":"c","text":"despite that"},{"id":"d","text":"for example"}]',
 'c', 'B1', 15),
('"She suggested ___ a taxi." — correct gerund use.',
 '[{"id":"a","text":"take"},{"id":"b","text":"to take"},{"id":"c","text":"taking"},{"id":"d","text":"taken"}]',
 'c', 'B1', 16),
('Which sentence contains a relative clause?',
 '[{"id":"a","text":"She likes coffee."},{"id":"b","text":"The book that I read was great."},{"id":"c","text":"He runs fast."},{"id":"d","text":"It is raining."}]',
 'b', 'B1', 17),
('Choose the correct phrasal verb: "Please ___ your shoes before entering."',
 '[{"id":"a","text":"take off"},{"id":"b","text":"take up"},{"id":"c","text":"take in"},{"id":"d","text":"take on"}]',
 'a', 'B1', 18),

-- B2
('"Had she known, she ___ differently." — what tense is this?',
 '[{"id":"a","text":"Second conditional"},{"id":"b","text":"Third conditional"},{"id":"c","text":"Mixed conditional"},{"id":"d","text":"Zero conditional"}]',
 'b', 'B2', 19),
('Choose the word closest in meaning to "ambiguous".',
 '[{"id":"a","text":"clear"},{"id":"b","text":"uncertain"},{"id":"c","text":"definite"},{"id":"d","text":"obvious"}]',
 'b', 'B2', 20),
('"___ to popular belief, bats are not blind." — best connector.',
 '[{"id":"a","text":"Despite"},{"id":"b","text":"Contrary"},{"id":"c","text":"Although"},{"id":"d","text":"However"}]',
 'b', 'B2', 21),
('Which uses the subjunctive correctly?',
 '[{"id":"a","text":"I suggest that he goes early."},{"id":"b","text":"I suggest that he go early."},{"id":"c","text":"I suggest that he went early."},{"id":"d","text":"I suggest that he gone early."}]',
 'b', 'B2', 22),
('What is "a blessing in disguise"?',
 '[{"id":"a","text":"A hidden problem"},{"id":"b","text":"Something good that seemed bad"},{"id":"c","text":"A disguised person"},{"id":"d","text":"A religious ceremony"}]',
 'b', 'B2', 23),
('"The new policy has far-reaching ___." — best word.',
 '[{"id":"a","text":"implications"},{"id":"b","text":"implications"},{"id":"c","text":"complications"},{"id":"d","text":"replications"}]',
 'a', 'B2', 24),

-- C1
('Which best describes "circumlocution"?',
 '[{"id":"a","text":"Using few words precisely"},{"id":"b","text":"Using many words to avoid saying something directly"},{"id":"c","text":"Writing in circles"},{"id":"d","text":"Contradicting oneself"}]',
 'b', 'C1', 25),
('"___ the project was underfunded, results exceeded expectations." — best choice.',
 '[{"id":"a","text":"Despite"},{"id":"b","text":"Although"},{"id":"c","text":"Notwithstanding"},{"id":"d","text":"Even"}]',
 'c', 'C1', 26),
('Choose the correct inversion: "Not only ___ late, but he also forgot the report."',
 '[{"id":"a","text":"he was"},{"id":"b","text":"was he"},{"id":"c","text":"he did"},{"id":"d","text":"did he was"}]',
 'b', 'C1', 27),
('What does "to be on the fence" mean?',
 '[{"id":"a","text":"To be physically on a fence"},{"id":"b","text":"To have a strong opinion"},{"id":"c","text":"To be undecided"},{"id":"d","text":"To change your mind"}]',
 'c', 'C1', 28),
('"The legislation was ___ after years of lobbying." — formal register.',
 '[{"id":"a","text":"made"},{"id":"b","text":"enacted"},{"id":"c","text":"done"},{"id":"d","text":"started"}]',
 'b', 'C1', 29),
('Which sentence uses a cleft correctly?',
 '[{"id":"a","text":"It was John who broke the vase."},{"id":"b","text":"It was John that breaking the vase."},{"id":"c","text":"It is John broke the vase."},{"id":"d","text":"It was John what broke the vase."}]',
 'a', 'C1', 30);