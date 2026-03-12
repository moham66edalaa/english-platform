# Decision Log — english-platform

> Significant product and technical decisions are logged here by the Product Manager agent.

---

### DEC-001: Project Initialization

- **Date:** 2026-03-12
- **Context:** Setting up project infrastructure for team collaboration
- **Decision:** Use the feature-workflow plugin with `.product/` directory for requirements tracking and `.claude/agents/` for team agent definitions
- **Rationale:** Provides session continuity, team coordination, and multi-user collaboration through git-tracked markdown files
- **Alternatives Considered:** External project management tools (Jira, Linear) — rejected because they don't integrate with Claude Code's agent system
- **Impact:** All team members must use `/resume` at session start and `/save-progress` at session end to maintain continuity

---

### DEC-002: Database Selection

- **Date:** 2026-03-12 (pre-existing)
- **Context:** Database and auth solution already chosen before init
- **Decision:** PostgreSQL via Supabase (hosted) with Row-Level Security policies. Auth via Supabase Auth (@supabase/ssr)
- **Rationale:** Supabase provides PostgreSQL + Auth + Realtime + Storage in a single managed platform, reducing infrastructure complexity
- **Alternatives Considered:** Prisma + self-hosted PostgreSQL, Firebase, MongoDB
- **Impact:** All data access goes through Supabase client. RLS policies enforce authorization at the database level. Migrations in `supabase/migrations/`.

---

### DEC-003: Deployment Targets

- **Date:** 2026-03-12
- **Context:** Choosing hosting platforms for the application
- **Decision:** Frontend + API → Vercel, Database → Supabase Cloud
- **Rationale:** Vercel is optimized for Next.js. Supabase Cloud provides managed PostgreSQL with built-in auth.
- **Alternatives Considered:** Self-hosted, Railway, AWS
- **Impact:** The `/deploy` skill will target Vercel. The `/setup-infra` skill will validate Vercel CLI and Supabase CLI.

---

### DEC-004: Role System

- **Date:** 2026-03-12 (pre-existing)
- **Context:** Migrating from 2-role (admin/student) to 3-role system
- **Decision:** Three roles: Owner (full admin), Teacher (course management), Student (learner)
- **Rationale:** Separation of owner/teacher responsibilities allows delegation of course management
- **Impact:** RLS policies updated in migration 002. Route groups: (owner), (teacher), (student). Old (admin) routes deleted.
