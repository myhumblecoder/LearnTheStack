# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LearnTheStack** is a self-directed 6-month curriculum to master a modern full-stack TypeScript architecture by building a single real application: an **AI-powered project tracker**. The project is docs-first — specs and schemas drive implementation, not the other way around.

No code exists yet. Start from `docs/studyplan.md` to understand where in the curriculum work should begin.

## Build Commands

> These will apply once the project is scaffolded (Month 1). Standard Next.js conventions are expected:

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check without emitting
npx prisma migrate dev   # Run migrations locally
npx prisma generate      # Regenerate Prisma client after schema changes
npx vitest           # Unit tests
npx playwright test  # E2E tests
```

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

The application manages: `Project` → `Epic` → `Story` (hierarchical). This model is introduced in Month 2 via Prisma schema and persists through all subsequent months.

## Environment Setup

- Local: `.env` file with `DATABASE_URL` (local Postgres or Neon dev branch), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ANTHROPIC_API_KEY`
- Neon branches mirror Git environments: `dev` branch → dev environment, `main` branch → prod
- Production secrets live in Vercel's environment vault, never in code

## Development Philosophy

- Docs-first: write a BMad spec (`.md` in repo) before any code for new features
- Derive Zod schemas, Prisma models, and tRPC signatures directly from the spec
- Every month's work produces a shippable artifact — keep the app in a runnable state
- Official docs are the primary reference (see `docs/studyplan.md` for links per layer)
