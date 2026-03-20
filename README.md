# Eloquence - English Learning Platform

A comprehensive English learning platform built with **Next.js 16**, **Supabase**, **Stripe**, and **Mux**. Supports three user roles (Student, Teacher, Admin) with features including courses, video lessons, placement tests, quizzes, assignments, live sessions, attendance tracking, certificates, and subscription-based payments.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [License](#license)

---

## Features

### Student Portal
- **Dashboard** with personalized welcome and course overview
- **Placement Test** to determine English proficiency level
- **Course Catalog** with enrollment and progress tracking
- **Video Lessons** powered by Mux streaming
- **Quizzes & Exams** with auto-grading
- **Assignments** submission and tracking
- **Schedule** view for upcoming classes
- **Attendance** records
- **Progress** tracking with visual indicators
- **Certificates** upon course completion
- **Subscription** management via Stripe
- **Profile** management

### Teacher Portal
- **Teacher Dashboard** with class overview
- **Course Management** and materials upload
- **Student Management** per group
- **Assignment** creation and grading
- **Exam** creation and results
- **Live Sessions** scheduling and management
- **Attendance** tracking per session
- **Announcements** for student groups
- **Profile** management

### Admin Panel
- **Analytics Dashboard** with platform metrics
- **Course CRUD** with sections, lessons, and pricing
- **Student & Teacher** management
- **Group** management and assignment
- **Level** configuration
- **Placement Test** configuration
- **Exam** management
- **Assignment** oversight
- **Live Session** management
- **Attendance** reports
- **Payment** tracking and reports
- **Platform Settings**

---

## Tech Stack

| Component       | Technology                          |
|-----------------|-------------------------------------|
| **Framework**   | Next.js 16 (App Router)             |
| **UI**          | React 19 + Tailwind CSS 4           |
| **Language**    | TypeScript 5                        |
| **Database**    | PostgreSQL (Supabase)               |
| **Auth**        | Supabase Auth with RLS              |
| **Payments**    | Stripe (Checkout + Webhooks)        |
| **Video**       | Mux (Streaming + Player)            |
| **Forms**       | React Hook Form + Zod validation    |
| **Icons**       | Lucide React                        |
| **Date Utils**  | date-fns                            |

---

## Architecture

Next.js App Router with **route groups** for role-based layouts and middleware-protected routes.

```
app/
  (auth)/        Login, Signup
  (public)/      Landing page, Course catalog, Placement test
  (student)/     Student dashboard and all student features
  (teacher)/     Teacher dashboard and management tools
  (admin)/       Admin panel with full platform control
  api/           7 API route handlers
```

- **Server Components** by default, `'use client'` only when needed
- **Row Level Security (RLS)** on all database tables
- **Middleware** for auth session management and route protection
- **Zod** for runtime input validation

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- A **Supabase** project (free tier works)
- A **Stripe** account (test mode)
- A **Mux** account (for video lessons)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/english-platform.git
cd english-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# 4. Run database migrations
# Apply the SQL files in supabase/migrations/ to your Supabase project
# via the Supabase Dashboard SQL Editor (in order: 001 -> 007)

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

---

## Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mux (Video)
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Warning:** Never commit `.env.local` to git. The `.gitignore` already excludes it.

---

## Database

### PostgreSQL via Supabase

The database schema is managed through sequential migration files:

| Migration | Description |
|-----------|-------------|
| `001_initial_schema.sql` | Core tables: users, courses, lessons, enrollments |
| `002_three_roles.sql` | Role system: student, teacher, admin |
| `003_fix_rls_recursion.sql` | RLS policy fixes |
| `004_full_dashboards.sql` | Dashboard support tables |
| `005_missing_features.sql` | Assignments, attendance, certificates |
| `006_rename_owner_to_admin.sql` | Role naming update |
| `007_ensure_user_profile.sql` | Profile auto-creation trigger |

### Applying Migrations

1. Go to your Supabase Dashboard > SQL Editor
2. Run each migration file in order (001 through 007)
3. Verify tables are created in the Table Editor

---

## User Roles

| Role | Access | Description |
|------|--------|-------------|
| **Student** | `/dashboard`, `/my-courses`, `/assignments`, etc. | Learners who enroll in courses and take tests |
| **Teacher** | `/teacher/*` | Instructors who manage courses and students |
| **Admin** | `/admin/*` | Platform administrators with full control |

All roles are enforced at the database level via **Row Level Security (RLS)** policies, ensuring data isolation between users.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/api/auth/callback` | Supabase auth callback handler |
| `POST` | `/api/courses/enroll` | Enroll student in a course |
| `POST` | `/api/placement-test/submit` | Submit placement test answers |
| `POST` | `/api/quizzes/submit` | Submit quiz answers |
| `POST` | `/api/assignments/submit` | Submit assignment |
| `POST` | `/api/progress/update` | Update lesson progress |
| `POST` | `/api/payments/webhook` | Stripe webhook handler |

---

## Project Structure

```
english-platform/
├── app/
│   ├── (auth)/                 # Login & Signup pages
│   ├── (public)/               # Landing, Courses catalog, Placement test
│   ├── (student)/              # Student dashboard & features (13 pages)
│   ├── (teacher)/              # Teacher dashboard & tools (10 pages)
│   ├── (admin)/                # Admin panel (17 pages)
│   └── api/                    # 7 API route handlers
├── components/
│   ├── admin/                  # Admin-specific components
│   ├── courses/                # Course cards, lists, details
│   ├── dashboard/              # Dashboard widgets
│   ├── landing/                # Landing page sections
│   ├── layout/                 # Shared layout components
│   ├── placement/              # Placement test components
│   ├── player/                 # Video player components
│   ├── quiz/                   # Quiz components
│   └── ui/                     # Reusable UI (Button, Card, Modal, Badge, Progress)
├── lib/
│   ├── supabase/               # Supabase client (browser + server)
│   ├── stripe.ts               # Stripe configuration
│   ├── quiz-grader.ts          # Quiz auto-grading logic
│   └── placement-grader.ts     # Placement test scoring
├── supabase/
│   └── migrations/             # 7 sequential SQL migration files
├── types/                      # Shared TypeScript type definitions
├── public/                     # Static assets
├── CLAUDE.md                   # AI assistant project instructions
└── package.json
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard
# Project Settings > Environment Variables
```

### Environment Setup for Production

1. Set all environment variables in your hosting platform
2. Configure Stripe webhook endpoint to `https://your-domain.com/api/payments/webhook`
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Ensure Supabase RLS policies are active

---

## Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## License

This project is private and proprietary.
