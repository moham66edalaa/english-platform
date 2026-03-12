# english-platform

English learning platform with courses, quizzes, placement tests, and video lessons.

## Product Documentation

The `.product/` directory contains all project management state:

| File | Purpose | Managed By |
|------|---------|------------|
| `.product/user-roles.md` | Requirements: user roles, use cases, acceptance criteria | Business Analyst agent |
| `.product/progress.md` | Session continuity: what was done, what's next | `/save-progress` skill |
| `.product/backlog.md` | Prioritized feature backlog | Product Manager agent |
| `.product/decisions.md` | Decision log with rationale | Product Manager agent |
| `.product/architecture.md` | Auto-detected tech stack and structure | `/analyze-codebase` skill |
| `.product/current-features.md` | Detected features, endpoints, pages, models | `/analyze-codebase` skill |
| `.product/TEAM-GUIDE.md` | Onboarding guide for teammates | `/init-project` skill |

**At the start of every session**, read `.product/progress.md` to understand current state. Or run `/resume` for a formatted summary.

## Workflow

1. `/resume` — Load session state and see what to work on
2. **BA agent** — Gather and document requirements in `user-roles.md`
3. **PM agent** — Review, prioritize, update `backlog.md`
4. `/use-case` — Define the business logic specification
5. `/develop` — Implement across all layers
6. `/test` — Write tests
7. `/ship` — Commit, push, deploy, verify production
8. `/save-progress` — Record session state for next time

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| Styling | Tailwind CSS | 4.2.0 |
| Database | PostgreSQL | Supabase Cloud |
| Auth | Supabase Auth | @supabase/ssr 0.5.2 |
| Payments | Stripe | 20.3.1 |
| Video | Mux | @mux/mux-player-react |
| Forms | React Hook Form + Zod | — |
| Language | TypeScript | 5.x |
| Package Manager | npm | — |

## Architecture

Next.js 16 App Router with **route groups** for role-based layouts:

```
app/
  (auth)/       — Login, Signup
  (public)/     — Landing, Course catalog, Placement test
  (student)/    — Dashboard, Courses, Assignments, Certificates
  (teacher)/    — Course management, Assignments, Live sessions
  (owner)/      — Full admin: CRUD, Analytics, Students, Pricing
  api/          — 7 API route handlers
components/     — Reusable UI components by domain
lib/            — Server helpers (auth, payments, supabase, quiz/placement graders)
supabase/       — Migrations and seed data
types/          — Shared TypeScript types
```

**Import alias:** `@/*` maps to project root.

## Database

- **Database:** PostgreSQL via Supabase Cloud
- **Auth:** Supabase Auth with RLS policies
- **Migrations:** `supabase/migrations/` (sequential SQL files)
- **Roles:** owner, teacher, student (3-role system with RLS enforcement)

## Deployment Targets

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend + API | Vercel | Not yet configured |
| Database | Supabase Cloud | Configured |
| Payments | Stripe | Configured |

Run `/setup-infra` to validate environment and credentials. Run `/deploy` to deploy.

## Conventions

- **Commits:** Conventional Commits format (`feat:`, `fix:`, `refactor:`, etc.)
- **Server Components** by default, `'use client'` only when needed
- **Supabase client:** `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server)
- **Validation:** Zod for all input validation
- **Secrets:** NEVER in git. Use `.env.local` for local dev, Vercel dashboard for production.

## Team Agents

Agent definitions in `.claude/agents/` are auto-detected by Claude Code:

| Agent | Role | Owns |
|-------|------|------|
| `product-manager` | Strategic oversight, prioritization | `backlog.md`, `decisions.md` |
| `business-analyst` | Requirements gathering | `user-roles.md` |
| `frontend-developer` | UI pages and components | `app/`, `components/` |
| `backend-developer` | API routes, DB, payments | `app/api/`, `lib/`, `supabase/` |
| `qa-engineer` | Testing and verification | Test files |
| `devops-engineer` | Git, deployment, verification | CI/CD, Vercel |
