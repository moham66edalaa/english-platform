# Team Guide — english-platform

> This guide is for human teammates who use Claude Code on this project.

## Prerequisites

Before you start, make sure you have:

- [ ] **Claude Code** installed with a Max plan
- [ ] **feature-workflow plugin** installed: `claude plugin add github:a7mad3akef/feature-workflow`
- [ ] **`gh` CLI** authenticated (for PR creation): `gh auth login`
- [ ] **`vercel` CLI** authenticated (for deployment): `vercel login`
- [ ] **Supabase CLI** installed (for migrations): `npm i -g supabase`

## Quick Start

1. **Clone the repo** — agents in `.claude/agents/` are auto-detected by Claude Code
2. **Run `/resume`** to see current project state
3. **Read `.product/backlog.md`** for what needs to be done
4. **Start working** — spawn agents as needed

## How to Use the System

### Starting a New Feature

Ask the BA agent to gather requirements:
> "Use the business-analyst agent to gather requirements for [feature name]"

### Building a Feature

Frontend and Backend work happens in the same Next.js app:
> "Use the frontend-developer agent to build the UI for UC-001"
> "Use the backend-developer agent to implement the API for UC-001"

### Testing

QA agent writes and runs tests:
> "Use the qa-engineer agent to test UC-001 end-to-end"

### Shipping

DevOps agent handles the full pipeline:
> "Use the devops-engineer agent to ship the current changes to production"

### End of Session

**Always run `/save-progress` before ending your session.**

### Start of Session

**Always run `/resume` when starting.**

## Important Conventions

- **Don't edit `.product/user-roles.md` manually** — use the BA agent
- **Don't reorder `.product/backlog.md` manually** — use the PM agent
- **Commit `.product/` changes alongside code changes** — they travel together
- **Always run `/save-progress` before ending** — the next person depends on it
- **Always run `/resume` when starting** — it loads full context

## Getting Help

- **Product questions** → PM agent
- **Requirements questions** → BA agent
- **Frontend issues** → Frontend Dev agent
- **Backend/API issues** → Backend Dev agent
- **Test failures** → QA agent
- **Deployment issues** → DevOps agent
- **Claude Code help** → `/help`
