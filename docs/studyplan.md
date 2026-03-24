# 6-Month TypeScript Stack Mastery Plan
> 1 hour/day · text and project based · no videos

---

## Guiding principles

- Every month produces a **shippable artifact** — not exercises, real things you keep
- Docs-first: official docs beat tutorials; source code beats blog posts
- Build the same domain across all 6 months so concepts compound
- The domain: **a personal AI-powered project tracker** (fits your BMad/Jira mental model and exercises every layer of the stack)

---

## Month 1 — Next.js App Router + TypeScript foundations
**Goal:** Be fluent in the App Router mental model and confident with TypeScript's type system at depth.

### Week 1 — App Router internals
- Read: [Next.js docs — App Router](https://nextjs.org/docs/app) — Routing, Layouts, Pages, Loading UI, Error Boundaries
- Read: [Next.js docs — Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering)
- Build: Scaffold the project tracker shell — root layout, a `/projects` route, a `/projects/[id]` dynamic route, loading and error states

### Week 2 — Server Actions
- Read: [Next.js docs — Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- Read: [Next.js docs — Forms and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms)
- Build: Add create/update/delete project actions. No DB yet — use in-memory state or a JSON file. Focus on the action pattern, not persistence.

### Week 3 — TypeScript at depth
- Read: [TypeScript Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- Read: [TypeScript Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- Read: [TypeScript Handbook — Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- Build: Type all your Server Action inputs and return types with generics. Write a `Result<T, E>` type and use it as your action return contract.

### Week 4 — Zod foundations
- Read: [Zod docs](https://zod.dev) — core API, transforms, refinements, error formatting
- Build: Replace all raw TypeScript types on Server Action inputs with Zod schemas. Infer the TS types from Zod (`z.infer<>`). Add `.refine()` validation to at least two fields.

**Month 1 artifact:** A Next.js app with typed routes, Server Actions, Zod-validated forms, and a working project CRUD flow (in-memory).

---

## Month 2 — Data layer: Prisma + PostgreSQL + Neon
**Goal:** Replace in-memory state with a real, fully type-safe data layer.

### Week 1 — Prisma schema and migrations
- Read: [Prisma docs — Data modeling](https://www.prisma.io/docs/orm/prisma-schema/data-model)
- Read: [Prisma docs — Migrations](https://www.prisma.io/docs/orm/prisma-migrate)
- Build: Model `Project`, `Epic`, `Story` in your Prisma schema. Run your first migration against a local Postgres instance.

### Week 2 — Prisma client and type inference
- Read: [Prisma docs — CRUD operations](https://www.prisma.io/docs/orm/prisma-client/queries/crud)
- Read: [Prisma docs — Select fields and relations](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields)
- Build: Wire all Server Actions to Prisma queries. Explore how Prisma's return types narrow based on your `select` — no manual typing needed.

### Week 3 — Neon + connection pooling
- Read: [Neon docs — Serverless driver](https://neon.tech/docs/serverless/serverless-driver)
- Read: [Neon docs — Connection pooling with PgBouncer](https://neon.tech/docs/connect/connection-pooling)
- Build: Migrate from local Postgres to a Neon branch. Configure pooled vs direct connections. Set up a dev branch and a prod branch in Neon.

### Week 4 — Advanced Prisma: transactions and raw queries
- Read: [Prisma docs — Transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)
- Build: Wrap multi-step story creation (create story + update epic status atomically) in a Prisma transaction. Add one raw SQL query for a reporting aggregate that Prisma can't express cleanly.

**Month 2 artifact:** Full persistence layer — projects, epics, stories stored in Neon, all CRUD wired through typed Prisma queries.

---

## Month 3 — Agent layer: Vercel AI SDK + Anthropic
**Goal:** Build a working agentic loop that can reason about and mutate your project tracker data.

### Week 1 — Vercel AI SDK core
- Read: [Vercel AI SDK docs — Overview](https://sdk.vercel.ai/docs/introduction)
- Read: [Vercel AI SDK docs — streamText and generateText](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text)
- Build: Add a `/assistant` route. Wire a basic `streamText` call that takes a user prompt and streams a response into the UI.

### Week 2 — Tool use and agentic loops
- Read: [Vercel AI SDK docs — Tools and tool calling](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- Read: [Vercel AI SDK docs — Multi-step tool calls (maxSteps)](https://sdk.vercel.ai/docs/ai-sdk-core/agents)
- Build: Define tools backed by your Prisma queries — `listProjects`, `createStory`, `updateStoryStatus`. Let the agent call them in sequence to fulfil a natural language request like "create three stories for the auth epic."

### Week 3 — Structured outputs + Zod integration
- Read: [Vercel AI SDK docs — generateObject / streamObject](https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data)
- Build: Replace free-text story creation with `generateObject` + a Zod schema. The agent now produces structured `Story` objects that pass directly into your Prisma create call — no parsing.

### Week 4 — Streaming UI
- Read: [Vercel AI SDK docs — AI SDK RSC / useChat](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot)
- Read: [Vercel AI SDK docs — Streaming with Server Actions](https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol)
- Build: Stream tool call progress into the UI so the user sees "Creating story…" as each tool fires, not just the final result.

**Month 3 artifact:** A working AI assistant tab in your project tracker — accepts natural language, calls Prisma-backed tools, streams progress, produces structured DB writes.

---

## Month 4 — API layer: tRPC + rate limiting + caching
**Goal:** Harden the API surface, add Upstash Redis for caching and rate limiting, introduce tRPC for any service boundary that needs it.

### Week 1 — tRPC fundamentals
- Read: [tRPC docs — Quickstart](https://trpc.io/docs/quickstart)
- Read: [tRPC docs — Routers and procedures](https://trpc.io/docs/server/routers)
- Read: [tRPC docs — Next.js integration](https://trpc.io/docs/client/nextjs/setup)
- Build: Move your project/epic/story queries out of Server Actions and into tRPC procedures. Observe how the type flows from Prisma → tRPC → client with zero manual casting.

### Week 2 — tRPC middleware + input validation
- Read: [tRPC docs — Middlewares](https://trpc.io/docs/server/middlewares)
- Build: Add an `authedProcedure` middleware. Add Zod `.input()` validation on all mutating procedures. Log all procedure calls with timing in a middleware.

### Week 3 — Upstash Redis: caching
- Read: [Upstash Redis docs — JavaScript SDK](https://upstash.com/docs/redis/sdks/ts/overview)
- Build: Cache the `listProjects` query result in Redis with a 60-second TTL. Invalidate the cache key on any project mutation. Measure and log the latency delta.

### Week 4 — Upstash Redis: rate limiting
- Read: [Upstash Ratelimit docs](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- Build: Apply a sliding window rate limit to your AI assistant endpoint — 20 requests per user per minute. Return a typed error that the UI surfaces gracefully.

**Month 4 artifact:** A hardened API layer — tRPC procedures with auth middleware, Redis-cached reads, rate-limited AI endpoint.

---

## Month 5 — BMad spec-driven workflow + advanced agent patterns
**Goal:** Apply your existing BMad methodology natively in TypeScript, and push the agent toward multi-step autonomous workflows.

### Week 1 — Spec-driven development in TS
- Exercise: Write a full BMad spec for a new feature (e.g. "sprint planning assistant") as a `.md` file in your repo
- Build: Derive your Zod schemas, Prisma models, and tRPC procedure signatures directly from the spec. The spec is the source of truth — code follows it, not the other way around.

### Week 2 — Multi-agent patterns
- Read: [Vercel AI SDK docs — Agents](https://sdk.vercel.ai/docs/ai-sdk-core/agents)
- Read: [Anthropic docs — Tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- Build: Split your assistant into two logical agents: a **Planner** (interprets intent, produces a structured plan) and an **Executor** (calls tools to carry out each step). Wire them in sequence — Planner output feeds Executor input.

### Week 3 — Agent memory and context management
- Read: [Anthropic docs — Long context best practices](https://docs.anthropic.com/en/docs/build-with-claude/long-context-tips)
- Build: Give your agent a conversation history stored in Redis (keyed by session). Summarise older turns before injecting them into context to stay within the token window. The agent should remember what was discussed earlier in a session.

### Week 4 — Prompt engineering as code
- Read: [Anthropic docs — Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- Build: Extract all system prompts into typed `PromptTemplate` functions that accept context params and return a fully-formed prompt string. Version them alongside your code — treat prompts as first-class artifacts, not inline strings.

**Month 5 artifact:** A Planner/Executor agent pair with session memory, typed prompt templates, and a spec-derived feature built end-to-end without writing a line of code before the spec was complete.

---

## Month 6 — Infra, CI/CD, and production hardening
**Goal:** Deploy your app to production with a professional-grade pipeline, observability, and environment management.

### Week 1 — Vercel deployment + environments
- Read: [Vercel docs — Projects and deployments](https://vercel.com/docs/deployments/overview)
- Read: [Vercel docs — Environment variables](https://vercel.com/docs/projects/environment-variables)
- Build: Deploy to Vercel. Configure three environments (dev/preview/prod) with separate Neon branches and separate Upstash instances per environment. Preview deployments auto-wire to the dev Neon branch.

### Week 2 — GitHub Actions CI pipeline
- Read: [GitHub Actions docs — Workflows](https://docs.github.com/en/actions/writing-workflows)
- Build: Write a CI workflow that runs `tsc --noEmit`, ESLint, Prisma migration check (`prisma migrate diff`), and your test suite on every PR. Block merges to `main` on failure.

### Week 3 — Testing
- Read: [Vitest docs](https://vitest.dev/guide/)
- Read: [Playwright docs — Getting started](https://playwright.dev/docs/intro)
- Build: Unit test all tRPC procedures with Vitest (mock Prisma with `vitest-mock-extended`). Write two Playwright e2e tests: one for project creation, one for the AI assistant completing a tool-use flow.

### Week 4 — Observability and error handling
- Read: [Vercel docs — Log drains](https://vercel.com/docs/observability/log-drains)
- Read: [OpenTelemetry JS docs — Getting started](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
- Build: Add structured logging to all tRPC procedures and agent tool calls. Instrument one critical path (story creation via agent) with OpenTelemetry traces. Set up a Sentry project and wire the Next.js error boundary to it.

**Month 6 artifact:** A production-deployed, CI-gated, test-covered, observable application — the full stack running live.

---

## Reference: key docs bookmarks

| Layer | Primary source |
|---|---|
| Next.js | https://nextjs.org/docs |
| TypeScript | https://www.typescriptlang.org/docs/handbook |
| Zod | https://zod.dev |
| Prisma | https://www.prisma.io/docs |
| Neon | https://neon.tech/docs |
| Vercel AI SDK | https://sdk.vercel.ai/docs |
| Anthropic | https://docs.anthropic.com |
| tRPC | https://trpc.io/docs |
| Upstash Redis | https://upstash.com/docs/redis |
| Vercel | https://vercel.com/docs |
| GitHub Actions | https://docs.github.com/en/actions |
| Vitest | https://vitest.dev/guide |
| Playwright | https://playwright.dev/docs |
