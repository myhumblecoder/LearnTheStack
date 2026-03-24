# TypeScript Fullstack + Agent Workflow Stack

## UI Layer

### Next.js App Router
Pages, layouts, and React Server Components. The primary shell for all UI and co-located agent logic.

### Server Actions
Co-located server functions that eliminate the need for explicit API endpoints. Agent orchestration logic lives in the same repo as the UI with no serialization boundary.

### tRPC
Type-safe API boundary for cases where an explicit procedure contract is needed — useful when external services or agents (e.g. Spike) need to call in.

---

## Agent Layer

### Vercel AI SDK
Core orchestration layer. Handles streaming, multi-step tool-use loops, and structured outputs natively against the Anthropic API.

### Zod
Schemas do double duty — they define both validation contracts and LLM tool definitions. The natural backbone for spec-driven development patterns.

### Anthropic SDK
Direct API access for lower-level control when the Vercel AI SDK abstraction is not sufficient.

---

## API Layer

### REST / tRPC Route Handlers
Standard Next.js route handlers or tRPC procedures for explicit API surfaces.

### TypeScript
End-to-end type safety across the entire stack — UI, API, agent, and data layers.

### Zod Validation
Input/output contracts enforced at API boundaries.

---

## Data Layer

### Prisma ORM
Fully type-inferred database access. Zero impedance mismatch with TypeScript — schema changes propagate through the type system automatically.

### PostgreSQL / Neon
Serverless-friendly Postgres. Neon is the preferred deployment target on Vercel due to connection pooling and branching support.

### Upstash Redis
Caching, LLM call rate limiting, and lightweight job queuing via a serverless Redis API.

---

## Infra Layer

### Vercel
Primary deployment target. Serverless and edge runtimes, preview environments per PR, and built-in secret vault management.

### GitHub Actions
CI/CD pipeline. Integrates with existing GitFlow setup — branch protection, CODEOWNERS enforcement, and automated test/lint/build gates.

### Env / Secrets
`.env` locally, Vercel environment vault in production. API keys (Anthropic, DB, Redis) scoped per environment.
