import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
type TopicType = "READ" | "BUILD" | "EXERCISE";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

interface TopicSeed {
  title: string;
  type: TopicType;
  content: string;
  resources: string[];
}

interface WeekSeed {
  weekNum: number;
  title: string;
  topics: TopicSeed[];
}

interface MonthSeed {
  id: number;
  title: string;
  description: string;
  weeks: WeekSeed[];
}

const curriculum: MonthSeed[] = [
  {
    id: 1,
    title: "Next.js App Router + TypeScript Foundations",
    description:
      "Be fluent in the App Router mental model and confident with TypeScript's type system at depth.",
    weeks: [
      {
        weekNum: 1,
        title: "App Router Internals",
        topics: [
          {
            title: "Routing, Layouts, Pages, Loading UI, Error Boundaries",
            type: "READ",
            content:
              "Study the Next.js App Router fundamentals: file-based routing, nested layouts, loading states, and error boundaries. Understand how the file system maps to URL segments and how layouts persist across navigations.",
            resources: ["https://nextjs.org/docs/app"],
          },
          {
            title: "Server vs Client Components",
            type: "READ",
            content:
              "Understand the rendering model: Server Components render on the server and send HTML, Client Components hydrate in the browser. Learn when to use 'use client' and the rules of composition.",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/rendering",
            ],
          },
          {
            title: "Scaffold Project Tracker Shell",
            type: "BUILD",
            content:
              "Build the project tracker shell: root layout, a /projects route, a /projects/[id] dynamic route, loading and error states. Practice nested layouts and dynamic segments.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 2,
        title: "Server Actions",
        topics: [
          {
            title: "Server Actions and Mutations",
            type: "READ",
            content:
              "Learn how Server Actions work: async functions that run on the server, callable from Client Components via forms or programmatically. Understand revalidation, redirects, and error handling in actions.",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations",
            ],
          },
          {
            title: "Forms and Mutations Patterns",
            type: "READ",
            content:
              "Deep dive into form patterns: progressive enhancement, useActionState, optimistic updates, and handling pending states in the UI.",
            resources: [
              "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms",
            ],
          },
          {
            title: "Build CRUD Actions",
            type: "BUILD",
            content:
              "Implement create/update/delete project actions. Use in-memory state for now. Focus on the Server Action pattern, form binding, revalidation, and error handling.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "TypeScript at Depth",
        topics: [
          {
            title: "Generics",
            type: "READ",
            content:
              "Master TypeScript generics: generic functions, classes, constraints, default type parameters. Understand how generics enable type-safe reusable code.",
            resources: [
              "https://www.typescriptlang.org/docs/handbook/2/generics.html",
            ],
          },
          {
            title: "Conditional and Template Literal Types",
            type: "READ",
            content:
              "Learn conditional types (extends, infer, distributive), mapped types, and template literal types. These are the building blocks for advanced type-level programming.",
            resources: [
              "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
              "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
            ],
          },
          {
            title: "Type Server Action Inputs with Generics",
            type: "BUILD",
            content:
              "Type all Server Action inputs and return types with generics. Write a Result<T, E> type and use it as your action return contract. Practice discriminated unions and exhaustive checking.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Zod Foundations",
        topics: [
          {
            title: "Zod Core API",
            type: "READ",
            content:
              "Learn Zod's core API: primitives, objects, arrays, unions, transforms, refinements, and error formatting. Understand how Zod bridges runtime validation and static types.",
            resources: ["https://zod.dev"],
          },
          {
            title: "Replace Types with Zod Schemas",
            type: "BUILD",
            content:
              "Replace all raw TypeScript types on Server Action inputs with Zod schemas. Infer TS types from Zod (z.infer<>). Add .refine() validation to at least two fields.",
            resources: [],
          },
          {
            title: "Zod Advanced Patterns Exercise",
            type: "EXERCISE",
            content:
              "Practice advanced Zod: discriminated unions, recursive schemas, custom error maps, and schema composition with .merge() and .extend(). Build a schema that validates nested project data.",
            resources: ["https://zod.dev"],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Data Layer: Prisma + PostgreSQL",
    description:
      "Replace in-memory state with a real, fully type-safe data layer.",
    weeks: [
      {
        weekNum: 1,
        title: "Prisma Schema and Migrations",
        topics: [
          {
            title: "Prisma Data Modeling",
            type: "READ",
            content:
              "Learn Prisma schema language: models, fields, relations (1:1, 1:n, m:n), enums, and attributes. Understand how the schema maps to database tables.",
            resources: [
              "https://www.prisma.io/docs/orm/prisma-schema/data-model",
            ],
          },
          {
            title: "Prisma Migrations",
            type: "READ",
            content:
              "Understand Prisma Migrate: creating migrations, applying them, resolving drift, and handling migration history. Learn the difference between dev and deploy workflows.",
            resources: ["https://www.prisma.io/docs/orm/prisma-migrate"],
          },
          {
            title: "Model Project/Epic/Story Schema",
            type: "BUILD",
            content:
              "Model Project, Epic, and Story in your Prisma schema with proper relations. Run your first migration against a local Postgres instance. Verify the schema with Prisma Studio.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 2,
        title: "Prisma Client and Type Inference",
        topics: [
          {
            title: "Prisma CRUD Operations",
            type: "READ",
            content:
              "Learn Prisma Client CRUD: create, findMany, findUnique, update, delete, upsert. Understand how Prisma generates type-safe query methods from your schema.",
            resources: [
              "https://www.prisma.io/docs/orm/prisma-client/queries/crud",
            ],
          },
          {
            title: "Select Fields and Relations",
            type: "READ",
            content:
              "Master Prisma's select and include. Understand how return types narrow based on your select — no manual typing needed. Learn relation loading strategies.",
            resources: [
              "https://www.prisma.io/docs/orm/prisma-client/queries/select-fields",
            ],
          },
          {
            title: "Wire Server Actions to Prisma",
            type: "BUILD",
            content:
              "Replace in-memory storage with Prisma queries. Wire all Server Actions to Prisma Client calls. Observe how Prisma's return types flow through your application.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Neon + Connection Pooling",
        topics: [
          {
            title: "Neon Serverless Driver",
            type: "READ",
            content:
              "Learn Neon's serverless driver: HTTP-based queries, WebSocket connections, and how it differs from traditional Postgres drivers. Understand cold starts and connection overhead.",
            resources: [
              "https://neon.tech/docs/serverless/serverless-driver",
            ],
          },
          {
            title: "Connection Pooling with PgBouncer",
            type: "READ",
            content:
              "Understand connection pooling: why serverless apps need it, how PgBouncer works in Neon, pooled vs direct connection strings, and transaction vs session mode.",
            resources: [
              "https://neon.tech/docs/connect/connection-pooling",
            ],
          },
          {
            title: "Migrate to Neon",
            type: "BUILD",
            content:
              "Migrate from local Postgres to a Neon branch. Configure pooled vs direct connections. Set up a dev branch and a prod branch in Neon.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Advanced Prisma",
        topics: [
          {
            title: "Prisma Transactions",
            type: "READ",
            content:
              "Learn Prisma transaction patterns: interactive transactions, sequential operations, nested writes. Understand isolation levels and when to use raw SQL.",
            resources: [
              "https://www.prisma.io/docs/orm/prisma-client/queries/transactions",
            ],
          },
          {
            title: "Build Transactional Operations",
            type: "BUILD",
            content:
              "Wrap multi-step story creation in a Prisma transaction. Add one raw SQL query for a reporting aggregate that Prisma can't express cleanly.",
            resources: [],
          },
          {
            title: "Prisma Advanced Queries Exercise",
            type: "EXERCISE",
            content:
              "Practice: aggregations, groupBy, cursor-based pagination, raw queries with type safety. Build a dashboard query that aggregates project stats across all relations.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Agent Layer: Vercel AI SDK + Anthropic",
    description:
      "Build a working agentic loop that can reason about and mutate your project tracker data.",
    weeks: [
      {
        weekNum: 1,
        title: "Vercel AI SDK Core",
        topics: [
          {
            title: "AI SDK Overview",
            type: "READ",
            content:
              "Learn the Vercel AI SDK architecture: providers, core functions (generateText, streamText), and the unified interface for different LLM providers.",
            resources: ["https://sdk.vercel.ai/docs/introduction"],
          },
          {
            title: "streamText and generateText",
            type: "READ",
            content:
              "Deep dive into text generation: streaming vs non-streaming, message format, system prompts, temperature, and response handling patterns.",
            resources: [
              "https://sdk.vercel.ai/docs/ai-sdk-core/generating-text",
            ],
          },
          {
            title: "Build Basic AI Chat",
            type: "BUILD",
            content:
              "Add an /assistant route. Wire a basic streamText call that takes a user prompt and streams a response into the UI. Get comfortable with the SDK's streaming pattern.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 2,
        title: "Tool Use and Agentic Loops",
        topics: [
          {
            title: "Tools and Tool Calling",
            type: "READ",
            content:
              "Learn AI SDK tool definitions: Zod schemas for parameters, execute functions, tool choice modes. Understand the tool call → result → continue loop.",
            resources: [
              "https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling",
            ],
          },
          {
            title: "Multi-step Tool Calls (maxSteps)",
            type: "READ",
            content:
              "Understand agentic loops with maxSteps: how the SDK automatically feeds tool results back to the model, enabling multi-step reasoning and sequential tool calls.",
            resources: ["https://sdk.vercel.ai/docs/ai-sdk-core/agents"],
          },
          {
            title: "Build Prisma-backed Tools",
            type: "BUILD",
            content:
              "Define tools backed by Prisma queries: listProjects, createStory, updateStoryStatus. Let the agent call them in sequence to fulfil natural language requests.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Structured Outputs + Zod Integration",
        topics: [
          {
            title: "generateObject / streamObject",
            type: "READ",
            content:
              "Learn structured output generation: Zod schemas as output format, mode options (json, tool), and how to get type-safe objects from LLM responses.",
            resources: [
              "https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data",
            ],
          },
          {
            title: "Build Structured Story Creation",
            type: "BUILD",
            content:
              "Replace free-text story creation with generateObject + a Zod schema. The agent produces structured Story objects that pass directly into Prisma create calls.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Streaming UI",
        topics: [
          {
            title: "useChat and Chatbot UI",
            type: "READ",
            content:
              "Learn the useChat hook: message management, streaming display, error handling, and how it connects to your API route. Understand the stream protocol.",
            resources: ["https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot"],
          },
          {
            title: "Streaming with Server Actions",
            type: "READ",
            content:
              "Understand streaming protocols: how responses flow from server to client, Data Stream Protocol, and how to display tool call progress in real-time.",
            resources: [
              "https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol",
            ],
          },
          {
            title: "Build Streaming Tool Progress UI",
            type: "BUILD",
            content:
              "Stream tool call progress into the UI so the user sees each tool firing in real-time, not just the final result. Build a polished chat interface.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "API Layer: tRPC + Rate Limiting + Caching",
    description:
      "Harden the API surface, add Upstash Redis for caching and rate limiting, introduce tRPC.",
    weeks: [
      {
        weekNum: 1,
        title: "tRPC Fundamentals",
        topics: [
          {
            title: "tRPC Quickstart",
            type: "READ",
            content:
              "Learn tRPC basics: routers, procedures, context, and the end-to-end type safety from server to client without code generation.",
            resources: ["https://trpc.io/docs/quickstart"],
          },
          {
            title: "Routers and Procedures",
            type: "READ",
            content:
              "Deep dive into tRPC routers: query vs mutation procedures, input validation, context injection, and router merging for modular APIs.",
            resources: ["https://trpc.io/docs/server/routers"],
          },
          {
            title: "Next.js Integration",
            type: "READ",
            content:
              "Set up tRPC with Next.js: API handler, client configuration, React Query integration, and server-side calling patterns.",
            resources: ["https://trpc.io/docs/client/nextjs/setup"],
          },
          {
            title: "Migrate to tRPC Procedures",
            type: "BUILD",
            content:
              "Move project/epic/story queries into tRPC procedures. Observe the type flow from Prisma → tRPC → client with zero manual casting.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 2,
        title: "tRPC Middleware + Validation",
        topics: [
          {
            title: "tRPC Middlewares",
            type: "READ",
            content:
              "Learn tRPC middleware: chaining, context extension, error handling, and how to build reusable procedure builders (authedProcedure, etc.).",
            resources: ["https://trpc.io/docs/server/middlewares"],
          },
          {
            title: "Build Auth and Logging Middleware",
            type: "BUILD",
            content:
              "Add an authedProcedure middleware. Add Zod .input() validation on all mutating procedures. Log all procedure calls with timing.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Upstash Redis: Caching",
        topics: [
          {
            title: "Upstash Redis SDK",
            type: "READ",
            content:
              "Learn the Upstash Redis JavaScript SDK: REST-based Redis, commands, pipelining, and how it differs from traditional Redis clients.",
            resources: [
              "https://upstash.com/docs/redis/sdks/ts/overview",
            ],
          },
          {
            title: "Build Redis Cache Layer",
            type: "BUILD",
            content:
              "Cache the listProjects query result in Redis with a 60-second TTL. Invalidate the cache key on any project mutation. Measure the latency delta.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Upstash Redis: Rate Limiting",
        topics: [
          {
            title: "Upstash Ratelimit",
            type: "READ",
            content:
              "Learn Upstash rate limiting: sliding window algorithm, token bucket, fixed window. Understand how to choose the right strategy for different endpoints.",
            resources: [
              "https://upstash.com/docs/redis/sdks/ratelimit-ts/overview",
            ],
          },
          {
            title: "Build Rate-Limited AI Endpoint",
            type: "BUILD",
            content:
              "Apply a sliding window rate limit to your AI assistant endpoint — 20 requests per user per minute. Return a typed error that the UI surfaces gracefully.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "BMad Spec-Driven Workflow + Advanced Agents",
    description:
      "Apply BMad methodology in TypeScript and push the agent toward multi-step autonomous workflows.",
    weeks: [
      {
        weekNum: 1,
        title: "Spec-Driven Development in TS",
        topics: [
          {
            title: "Write a BMad Feature Spec",
            type: "EXERCISE",
            content:
              "Write a full BMad spec for a new feature (sprint planning assistant) as a .md file. Define the problem, solution, data model changes, and API surface before writing any code.",
            resources: [],
          },
          {
            title: "Derive Code from Spec",
            type: "BUILD",
            content:
              "Derive Zod schemas, Prisma models, and tRPC procedure signatures directly from your spec. The spec is the source of truth — code follows it.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 2,
        title: "Multi-Agent Patterns",
        topics: [
          {
            title: "AI SDK Agents",
            type: "READ",
            content:
              "Study agent patterns in the Vercel AI SDK: multi-step tool use, agent loops, and how to compose agents for complex workflows.",
            resources: ["https://sdk.vercel.ai/docs/ai-sdk-core/agents"],
          },
          {
            title: "Anthropic Tool Use",
            type: "READ",
            content:
              "Learn Anthropic's tool use patterns: tool definitions, forced tool use, parallel tool calls, and best practices for reliable tool execution.",
            resources: [
              "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
            ],
          },
          {
            title: "Build Planner/Executor Agents",
            type: "BUILD",
            content:
              "Split your assistant into a Planner (interprets intent, produces structured plan) and an Executor (calls tools to carry out each step). Wire them in sequence.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Agent Memory and Context",
        topics: [
          {
            title: "Long Context Best Practices",
            type: "READ",
            content:
              "Learn strategies for managing long conversations: context windowing, summarization of older turns, and techniques to stay within token limits while preserving important context.",
            resources: [
              "https://docs.anthropic.com/en/docs/build-with-claude/long-context-tips",
            ],
          },
          {
            title: "Build Session Memory",
            type: "BUILD",
            content:
              "Give your agent conversation history stored in Redis, keyed by session. Summarise older turns before injecting into context. The agent should remember earlier discussion.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Prompt Engineering as Code",
        topics: [
          {
            title: "Prompt Engineering Overview",
            type: "READ",
            content:
              "Study Anthropic's prompt engineering guide: system prompts, role prompting, chain-of-thought, few-shot examples, and XML tags for structure.",
            resources: [
              "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
            ],
          },
          {
            title: "Build Typed Prompt Templates",
            type: "BUILD",
            content:
              "Extract all system prompts into typed PromptTemplate functions that accept context params and return fully-formed prompts. Version them alongside your code.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Infra, CI/CD, and Production Hardening",
    description:
      "Deploy to production with a professional-grade pipeline, observability, and environment management.",
    weeks: [
      {
        weekNum: 1,
        title: "Vercel Deployment + Environments",
        topics: [
          {
            title: "Vercel Projects and Deployments",
            type: "READ",
            content:
              "Learn Vercel deployment: project setup, build settings, deployment lifecycle, and how preview/production deployments work.",
            resources: ["https://vercel.com/docs/deployments/overview"],
          },
          {
            title: "Vercel Environment Variables",
            type: "READ",
            content:
              "Understand Vercel environment management: dev/preview/production scopes, secret encryption, and how to wire different backends per environment.",
            resources: [
              "https://vercel.com/docs/projects/environment-variables",
            ],
          },
          {
            title: "Deploy to Vercel",
            type: "BUILD",
            content:
              "Deploy to Vercel with three environments (dev/preview/prod). Configure separate Neon branches and Upstash instances per environment.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 2,
        title: "GitHub Actions CI Pipeline",
        topics: [
          {
            title: "GitHub Actions Workflows",
            type: "READ",
            content:
              "Learn GitHub Actions: workflow files, triggers, jobs, steps, matrix builds, caching, and how to compose reusable workflows.",
            resources: [
              "https://docs.github.com/en/actions/writing-workflows",
            ],
          },
          {
            title: "Build CI Pipeline",
            type: "BUILD",
            content:
              "Write a CI workflow: tsc --noEmit, ESLint, Prisma migration check, and test suite on every PR. Block merges to main on failure.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Testing",
        topics: [
          {
            title: "Vitest Guide",
            type: "READ",
            content:
              "Learn Vitest: test syntax, matchers, mocking, setup/teardown, and how it integrates with TypeScript and ESM out of the box.",
            resources: ["https://vitest.dev/guide/"],
          },
          {
            title: "Playwright Getting Started",
            type: "READ",
            content:
              "Learn Playwright: browser automation, locators, assertions, test fixtures, and how to write reliable end-to-end tests.",
            resources: ["https://playwright.dev/docs/intro"],
          },
          {
            title: "Write Unit and E2E Tests",
            type: "BUILD",
            content:
              "Unit test tRPC procedures with Vitest. Write Playwright e2e tests for project creation and the AI assistant tool-use flow.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Observability and Error Handling",
        topics: [
          {
            title: "Vercel Log Drains",
            type: "READ",
            content:
              "Learn Vercel observability: log drains, function logs, and how to pipe structured logs to external systems.",
            resources: ["https://vercel.com/docs/observability/log-drains"],
          },
          {
            title: "OpenTelemetry JS",
            type: "READ",
            content:
              "Learn OpenTelemetry for Node.js: spans, traces, context propagation, and instrumentation of HTTP requests and database calls.",
            resources: [
              "https://opentelemetry.io/docs/languages/js/getting-started/nodejs/",
            ],
          },
          {
            title: "Build Observability Layer",
            type: "BUILD",
            content:
              "Add structured logging to all tRPC procedures and agent tool calls. Instrument story creation via agent with OpenTelemetry traces. Wire Sentry to the Next.js error boundary.",
            resources: [],
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Seeding curriculum data...");

  for (const month of curriculum) {
    await prisma.month.upsert({
      where: { id: month.id },
      update: { title: month.title, description: month.description },
      create: { id: month.id, title: month.title, description: month.description },
    });

    for (const week of month.weeks) {
      const weekRecord = await prisma.week.upsert({
        where: {
          monthId_weekNum: { monthId: month.id, weekNum: week.weekNum },
        },
        update: { title: week.title },
        create: {
          monthId: month.id,
          weekNum: week.weekNum,
          title: week.title,
        },
      });

      for (let i = 0; i < week.topics.length; i++) {
        const topic = week.topics[i];
        const existing = await prisma.topic.findUnique({
          where: { weekId_sortOrder: { weekId: weekRecord.id, sortOrder: i + 1 } },
        });

        if (existing) {
          await prisma.topic.update({
            where: { id: existing.id },
            data: {
              title: topic.title,
              type: topic.type,
              content: topic.content,
              resources: topic.resources,
            },
          });
        } else {
          const created = await prisma.topic.create({
            data: {
              weekId: weekRecord.id,
              sortOrder: i + 1,
              title: topic.title,
              type: topic.type,
              content: topic.content,
              resources: topic.resources,
            },
          });

          await prisma.topicProgress.create({
            data: { topicId: created.id },
          });
        }
      }
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
