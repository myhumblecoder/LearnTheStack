# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LearnTheStack** is a self-directed full-stack TypeScript mastery curriculum **and** the real application it produces: an **AI-powered study tracker** for the curriculum itself. The app is the thing you learn on — you deepen each layer of the stack by extending it. The project is docs-first — specs and schemas drive implementation, not the other way around.

The curriculum has been extended to a **9-month plan (Jun 2026 → Feb 2027)** covering the core stack plus three added tracks (Claude Code, Azure AI-900, DSA). See `docs/studyplan-extended.md` for the dated plan and `docs/studyplan.md` for the original 6-month spine.

The app already exists and runs. Key surfaces: a dashboard, daily/weekly/monthly schedule views (`/today`, `/week`, `/month`), an AI tutor chat per topic, quizzes, code review, and a pomodoro timer in the header that logs focused sessions.

## Build Commands

```bash
npm run dev          # Start development server (Next.js)
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check without emitting
npm run db:migrate   # prisma migrate dev — run migrations locally
npm run db:seed      # tsx prisma/seed.ts — load the 9-month curriculum
npm run db:reset     # prisma migrate reset --force — wipe + re-migrate
npm run db:studio    # Prisma Studio
npx prisma generate  # Regenerate Prisma client after schema changes (no DB needed)
```

Local Postgres runs via `docker-compose up -d db` (see `docker-compose.yml`). The Prisma client is generated to `src/generated/prisma`.

## Architecture

The app is organized in four layers. Each layer has a single responsibility and a well-defined boundary to the layer below it.

```
UI Layer         → Next.js App Router (RSC, Server Actions, layouts)
Agent Layer      → Vercel AI SDK + Anthropic SDK + Zod tool schemas
API Layer        → tRPC procedures + Zod input validation
Data Layer       → Prisma ORM → PostgreSQL (Neon) + Redis (Upstash)
```

**Key patterns:**
- **Server Actions** are the default for UI→server calls; tRPC is used when an explicit procedure contract is needed (e.g., for external callers or the agent layer)
- **Zod schemas serve dual purpose**: runtime validation AND LLM tool definitions — define once, use both places
- **Prisma types flow upstream automatically** — never manually type database return shapes; let `select` narrow the type
- **Agent architecture (Month 5+)**: Planner agent interprets intent → produces structured plan → Executor agent calls Prisma-backed tools to carry it out
- **Session memory** is stored in Upstash Redis, keyed by session ID, with summarization of older turns to stay within token limits
- **Prompt templates** are typed `PromptTemplate` functions, versioned in code alongside the features they serve

## Domain Model

The application models the curriculum itself: `Month` → `Week` → `Topic` (hierarchical). Supporting models:
- `TopicProgress` — per-topic status (NOT_STARTED → IN_PROGRESS → QUIZ_PENDING → COMPLETED)
- `Resource` — typed study resources (DOC / VIDEO / TEXTBOOK) attached to a topic
- `Track` enum on `Topic` — CORE / DSA / AZURE / CLAUDE_CODE (the four study tracks)
- `Topic.scheduledDate` + `Month`/`Week` `startDate`/`endDate` — the calendar that powers the daily/weekly/monthly views; `Month.isBuffer` flags the December slack month
- `StudySession` — pomodoro sessions (`pomodoros`, `totalMinutes`, optional `topicId`)
- `QuizAttempt`, `ChatMessage`, `MessageFeedback` — quizzes and AI tutor chat with thumbs up/down

The seed (`prisma/seed.ts`) loads the full dated 9-month curriculum; it computes week and topic dates from each month's calendar start. Schedule queries live in `src/lib/curriculum/schedule.ts`.

## Environment Setup

- Local: `.env` file with `DATABASE_URL` (local Postgres or Neon dev branch), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ANTHROPIC_API_KEY`
- Neon branches mirror Git environments: `dev` branch → dev environment, `main` branch → prod
- Production secrets live in Vercel's environment vault, never in code

## Development Philosophy

- Docs-first: write a BMad spec (`.md` in repo) before any code for new features
- Derive Zod schemas, Prisma models, and tRPC signatures directly from the spec
- Every month's work produces a shippable artifact — keep the app in a runnable state
- Official docs are the primary reference (see `docs/studyplan.md` for links per layer)
