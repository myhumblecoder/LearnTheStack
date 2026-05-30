import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

type TopicType = "READ" | "BUILD" | "EXERCISE";
type Track = "CORE" | "DSA" | "AZURE" | "CLAUDE_CODE";
type ResourceType = "DOC" | "VIDEO" | "TEXTBOOK";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

interface ResourceSeed {
  type: ResourceType;
  label: string;
  url?: string;
  source?: string;
}

interface TopicSeed {
  title: string;
  type: TopicType;
  track?: Track; // defaults to CORE
  content: string;
  resources?: ResourceSeed[];
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
  year: number;
  month: number; // 1-12 calendar month
  isBuffer?: boolean;
  weeks: WeekSeed[];
}

// ---------------------------------------------------------------------------
// Reusable course resources (the user's owned Udemy library)
// ---------------------------------------------------------------------------
const VID = {
  tsGrider: (): ResourceSeed => ({
    type: "VIDEO",
    label: "TypeScript: The Complete Developer's Guide",
    source: "Stephen Grider · Udemy",
  }),
  claudeCode: (): ResourceSeed => ({
    type: "VIDEO",
    label: "Claude Code: Building Faster with AI, Prototype to Prod",
    source: "Frank Kane · Udemy",
  }),
  agentic: (): ResourceSeed => ({
    type: "VIDEO",
    label: "AI Engineer Agentic Track: Agent & MCP",
    source: "Ed Donner · Udemy",
  }),
  ai900: (): ResourceSeed => ({
    type: "VIDEO",
    label: "AI-900: Azure AI Fundamentals in a Weekend",
    source: "in28Minutes · Udemy",
  }),
  dsa: (): ResourceSeed => ({
    type: "VIDEO",
    label: "Master the Coding Interview: Data Structures + Algorithms",
    source: "Andrei Neagoie · Udemy",
  }),
};

const doc = (label: string, url: string): ResourceSeed => ({
  type: "DOC",
  label,
  url,
});

// O'Reilly Learning textbook (the user has a subscription covering any title).
const oreilly = (title: string, author: string): ResourceSeed => ({
  type: "TEXTBOOK",
  label: title,
  source: `${author} · O'Reilly Learning`,
});

// Skiena, "The Algorithm Design Manual" — the user's owned DSA reference.
const skiena = (chapters: string): ResourceSeed => ({
  type: "TEXTBOOK",
  label: `The Algorithm Design Manual — ${chapters}`,
  source: "Steven Skiena",
});

// A standard monthly DSA topic, parameterised by focus and its Skiena chapters.
function dsaTopic(
  focus: string,
  practice: string,
  skienaChapters: string
): TopicSeed {
  return {
    title: `DSA: ${focus}`,
    type: "EXERCISE",
    track: "DSA",
    content: `Steady fundamentals track (no deadline). This month: ${focus}. Aim for ~2 problems/week, written in TypeScript so it reinforces the stack work. ${practice} Use the video for theory, Skiena for depth, and any judge (LeetCode/Exercism) for reps. Log solutions in your personal algorithms/ repo.`,
    resources: [VID.dsa(), skiena(skienaChapters)],
  };
}

// ---------------------------------------------------------------------------
// The 9-month extended curriculum (Jun 2026 → Feb 2027)
// Domain note: the "build" tasks extend THIS study-tracker app
// (Month → Week → Topic), which is the real domain you learn on.
// ---------------------------------------------------------------------------
const curriculum: MonthSeed[] = [
  {
    id: 1,
    title: "Next.js App Router + TypeScript Foundations",
    description:
      "Be fluent in the App Router mental model and confident with TypeScript at depth. Front-load Claude Code so every later month is faster.",
    year: 2026,
    month: 6,
    weeks: [
      {
        weekNum: 1,
        title: "App Router Internals + Claude Code On-Ramp",
        topics: [
          {
            title: "Routing, Layouts, Pages, Loading UI, Error Boundaries",
            type: "READ",
            content:
              "Study the Next.js App Router fundamentals: file-based routing, nested layouts, loading states, and error boundaries. Trace how this app's src/app folder maps to its URL segments.",
            resources: [doc("Next.js — App Router", "https://nextjs.org/docs/app")],
          },
          {
            title: "Server vs Client Components",
            type: "READ",
            content:
              "Understand the rendering model: Server Components render on the server, Client Components hydrate in the browser. Find examples of each in this app (Sidebar is a Server Component; ChatPanel is a Client Component).",
            resources: [
              doc(
                "Next.js — Rendering",
                "https://nextjs.org/docs/app/building-your-application/rendering"
              ),
            ],
          },
          {
            title: "Claude Code On-Ramp (part 1)",
            type: "BUILD",
            track: "CLAUDE_CODE",
            content:
              "Highest-leverage fortnight in the plan. Watch Kane's course and tune Claude Code on THIS repo: refine CLAUDE.md and add one custom slash command for a workflow you repeat.",
            resources: [VID.claudeCode()],
          },
        ],
      },
      {
        weekNum: 2,
        title: "Server Actions + Claude Code On-Ramp",
        topics: [
          {
            title: "Server Actions and Mutations",
            type: "READ",
            content:
              "Learn how Server Actions work: async server functions callable from the client. Read this app's src/actions (progress.ts, session.ts, feedback.ts) to see real examples.",
            resources: [
              doc(
                "Next.js — Server Actions",
                "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations"
              ),
            ],
          },
          {
            title: "Claude Code On-Ramp (part 2)",
            type: "BUILD",
            track: "CLAUDE_CODE",
            content:
              "Add one hook (e.g. run `tsc --noEmit` after edits) and connect one MCP server (Notion/GitHub). From here on, build every month WITH Claude Code as a pair.",
            resources: [VID.claudeCode()],
          },
          {
            title: "Add a Server Action to this app",
            type: "BUILD",
            content:
              "Extend the app: add a Server Action (e.g. mark a topic complete from the dashboard, or add a study note). Practice revalidation, pending states, and error handling.",
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
              "Master TypeScript generics: generic functions, classes, constraints, default type parameters. Grider's course is excellent scaffolding here.",
            resources: [
              doc(
                "TS Handbook — Generics",
                "https://www.typescriptlang.org/docs/handbook/2/generics.html"
              ),
              VID.tsGrider(),
              oreilly("Programming TypeScript", "Boris Cherny"),
            ],
          },
          {
            title: "Conditional and Template Literal Types",
            type: "READ",
            content:
              "Learn conditional types (extends, infer, distributive), mapped types, and template literal types — the building blocks for type-level programming.",
            resources: [
              doc(
                "TS Handbook — Conditional Types",
                "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html"
              ),
              VID.tsGrider(),
            ],
          },
          {
            title: "Type the action layer with generics",
            type: "BUILD",
            content:
              "Write a Result<T, E> type and use it as the return contract for this app's Server Actions. Practice discriminated unions and exhaustive checking.",
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
              "Learn Zod's core API: primitives, objects, unions, transforms, refinements, error formatting. This app already uses Zod v4 — see src/lib/ai/schemas.ts.",
            resources: [doc("Zod", "https://zod.dev")],
          },
          {
            title: "Validate action inputs with Zod",
            type: "BUILD",
            content:
              "Add Zod schemas to this app's Server Action inputs and infer the TS types with z.infer<>. Add .refine() validation to at least two fields.",
            resources: [],
          },
          {
            title: "Zod Advanced Patterns Exercise",
            type: "EXERCISE",
            content:
              "Practice discriminated unions, recursive schemas, custom error maps, and composition with .merge()/.extend().",
            resources: [doc("Zod", "https://zod.dev")],
          },
          dsaTopic(
            "Big-O, arrays, strings, hash maps",
            "Start with Big-O intuition, then array/string traversal and hash-map lookups.",
            "ch. 1–2 (intro & algorithm analysis), 3.7 (hashing)"
          ),
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Data Layer: Prisma + PostgreSQL + Neon",
    description:
      "Deepen the data layer that already powers this app, then take it to Neon.",
    year: 2026,
    month: 7,
    weeks: [
      {
        weekNum: 1,
        title: "Prisma Schema and Migrations",
        topics: [
          {
            title: "Prisma Data Modeling",
            type: "READ",
            content:
              "Learn the Prisma schema language: models, fields, relations, enums, attributes. Read this app's prisma/schema.prisma — Month → Week → Topic with progress, quizzes, resources.",
            resources: [
              doc(
                "Prisma — Data model",
                "https://www.prisma.io/docs/orm/prisma-schema/data-model"
              ),
              oreilly("Designing Data-Intensive Applications", "Martin Kleppmann"),
            ],
          },
          {
            title: "Prisma Migrations",
            type: "READ",
            content:
              "Understand Prisma Migrate: creating, applying, resolving drift, migration history, dev vs deploy workflows.",
            resources: [
              doc("Prisma — Migrate", "https://www.prisma.io/docs/orm/prisma-migrate"),
            ],
          },
          {
            title: "Extend the schema with a real migration",
            type: "BUILD",
            content:
              "Add a feature to this app's schema (e.g. a StudyNote model, or tags on Topic). Run a migration with `npm run db:migrate` and verify in Prisma Studio.",
            resources: [],
          },
          dsaTopic(
            "Two pointers, sliding window",
            "Classic patterns for array/string subranges.",
            "ch. 3 (data structures), 4.x (arrays)"
          ),
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
              "Learn Prisma Client CRUD and how it generates type-safe methods. Compare against this app's src/lib/curriculum/queries.ts.",
            resources: [
              doc(
                "Prisma — CRUD",
                "https://www.prisma.io/docs/orm/prisma-client/queries/crud"
              ),
            ],
          },
          {
            title: "Select Fields and Relations",
            type: "READ",
            content:
              "Master select and include and how return types narrow from your select — no manual typing. This app relies on this heavily.",
            resources: [
              doc(
                "Prisma — Select fields",
                "https://www.prisma.io/docs/orm/prisma-client/queries/select-fields"
              ),
            ],
          },
          {
            title: "Add a typed query to this app",
            type: "BUILD",
            content:
              "Write a new query in queries.ts (e.g. study minutes per week, or topics-by-track) and surface it in the dashboard. Let the select drive the type.",
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
              "Learn Neon's serverless driver: HTTP queries, WebSocket connections, cold starts, connection overhead.",
            resources: [
              doc(
                "Neon — Serverless driver",
                "https://neon.tech/docs/serverless/serverless-driver"
              ),
            ],
          },
          {
            title: "Connection Pooling with PgBouncer",
            type: "READ",
            content:
              "Understand pooled vs direct connections, transaction vs session mode, and why serverless needs pooling.",
            resources: [
              doc(
                "Neon — Connection pooling",
                "https://neon.tech/docs/connect/connection-pooling"
              ),
            ],
          },
          {
            title: "Move this app from local Postgres to Neon",
            type: "BUILD",
            content:
              "Migrate from the local docker Postgres to a Neon branch. Configure pooled vs direct URLs and set up dev + prod branches.",
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
              "Learn interactive transactions, sequential operations, nested writes, isolation levels, and when to drop to raw SQL.",
            resources: [
              doc(
                "Prisma — Transactions",
                "https://www.prisma.io/docs/orm/prisma-client/queries/transactions"
              ),
            ],
          },
          {
            title: "Add a transactional + raw-SQL operation",
            type: "BUILD",
            content:
              "Wrap a multi-step write in a transaction (e.g. complete topic + record a study session atomically). Add one raw SQL aggregate for a reporting stat.",
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
      "Deepen the AI tutor that already lives in this app and make its agentic loop real.",
    year: 2026,
    month: 8,
    weeks: [
      {
        weekNum: 1,
        title: "Vercel AI SDK Core",
        topics: [
          {
            title: "AI SDK Overview",
            type: "READ",
            content:
              "Learn the Vercel AI SDK architecture: providers, generateText/streamText, the unified interface. This app uses ai v6 + @ai-sdk/anthropic — see src/lib/ai/tutor.ts.",
            resources: [
              doc("Vercel AI SDK", "https://sdk.vercel.ai/docs/introduction"),
              oreilly("AI Engineering", "Chip Huyen"),
            ],
          },
          {
            title: "streamText and generateText",
            type: "READ",
            content:
              "Streaming vs non-streaming, message format, system prompts, temperature. Trace how this app streams tutor responses in api/chat/route.ts.",
            resources: [
              doc(
                "AI SDK — Generating text",
                "https://sdk.vercel.ai/docs/ai-sdk-core/generating-text"
              ),
            ],
          },
          dsaTopic(
            "Stacks, queues, linked lists",
            "Pointer manipulation and LIFO/FIFO structures.",
            "ch. 3.1–3.2 (stacks, queues, linked lists)"
          ),
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
              "Learn AI SDK tool definitions: Zod parameter schemas, execute functions, tool choice. Concepts also covered in Donner's Agentic Track (translate from Python/OpenAI to your TS/Anthropic stack).",
            resources: [
              doc(
                "AI SDK — Tools",
                "https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling"
              ),
              VID.agentic(),
            ],
          },
          {
            title: "Multi-step Tool Calls (maxSteps)",
            type: "READ",
            content:
              "Understand agentic loops with maxSteps: how tool results feed back to the model for multi-step reasoning.",
            resources: [
              doc("AI SDK — Agents", "https://sdk.vercel.ai/docs/ai-sdk-core/agents"),
            ],
          },
          {
            title: "Give the tutor Prisma-backed tools",
            type: "BUILD",
            content:
              "Define tools backed by this app's queries (e.g. markTopicComplete, listUpcomingTopics, logStudySession) so the tutor can act on your schedule, not just talk.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Structured Outputs + Zod",
        topics: [
          {
            title: "generateObject / streamObject",
            type: "READ",
            content:
              "Structured output with Zod schemas as the output format. This app's quizzes already lean on structured results.",
            resources: [
              doc(
                "AI SDK — Structured data",
                "https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data"
              ),
            ],
          },
          {
            title: "Generate a structured study plan adjustment",
            type: "BUILD",
            content:
              "Use generateObject + a Zod schema so the tutor can propose a structured re-plan (e.g. reschedule missed topics) that writes straight to the DB.",
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
              "Learn the useChat hook and stream protocol. This app's ChatPanel/MessageBubble are a working reference.",
            resources: [doc("AI SDK — Chatbot", "https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot")],
          },
          {
            title: "Stream tool-call progress in the UI",
            type: "BUILD",
            content:
              "Show each tool firing in real time (\"Rescheduling 2 topics…\") instead of only the final answer.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Azure AI-900 Cert Sprint",
    description:
      "A change-of-pace credential month. Off-stack but a real cert — sit the exam in the last week. Core paused.",
    year: 2026,
    month: 9,
    weeks: [
      {
        weekNum: 1,
        title: "AI-900 Foundations (first half)",
        topics: [
          {
            title: "AI workloads & ML fundamentals",
            type: "READ",
            track: "AZURE",
            content:
              "Work through the first half of the in28Minutes course: AI workloads, responsible AI, and core machine learning concepts. Take notes.",
            resources: [
              VID.ai900(),
              doc(
                "Microsoft Learn — AI-900",
                "https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/"
              ),
            ],
          },
          dsaTopic(
            "Recursion (light — cert month)",
            "Keep it light this month; just recursion intuition and a couple of problems.",
            "ch. 5.1–5.3 (recursion & backtracking)"
          ),
        ],
      },
      {
        weekNum: 2,
        title: "AI-900 Foundations (second half)",
        topics: [
          {
            title: "Computer vision, NLP & generative AI on Azure",
            type: "READ",
            track: "AZURE",
            content:
              "Finish the course: Azure AI Vision, Language, Document Intelligence, and Azure OpenAI / generative AI services. Cross-reference the Microsoft Learn AI-900 path.",
            resources: [
              VID.ai900(),
              doc(
                "Microsoft Learn — AI-900 path",
                "https://learn.microsoft.com/training/courses/ai-900t00/"
              ),
            ],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Hands-On in the Azure Portal",
        topics: [
          {
            title: "Provision and map Azure AI services",
            type: "BUILD",
            track: "AZURE",
            content:
              "In the free Azure portal, provision a Cognitive/AI service and try Azure OpenAI and AI Foundry. For each Azure concept, write the Anthropic/Vercel equivalent you already use.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Practice Exams + Sit the Exam",
        topics: [
          {
            title: "Timed practice exams",
            type: "EXERCISE",
            track: "AZURE",
            content:
              "Take 2–3 timed practice exams. Aim for 85%+ consistently before booking.",
            resources: [VID.ai900()],
          },
          {
            title: "🎯 Sit the AI-900 exam",
            type: "EXERCISE",
            track: "AZURE",
            content:
              "Book and sit the AI-900 exam this week so it doesn't loom over the rest of the plan. Then write a one-page 'Azure AI ↔ my stack' note as the artifact.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "API Layer: tRPC + Rate Limiting + Caching",
    description:
      "Add the two stack pieces not yet installed — tRPC and Upstash Redis — by hardening this app's API surface.",
    year: 2026,
    month: 10,
    weeks: [
      {
        weekNum: 1,
        title: "tRPC Fundamentals",
        topics: [
          {
            title: "tRPC Quickstart + Routers/Procedures",
            type: "READ",
            content:
              "Learn tRPC: routers, query vs mutation procedures, context, end-to-end type safety with no codegen.",
            resources: [
              doc("tRPC — Quickstart", "https://trpc.io/docs/quickstart"),
              doc("tRPC — Routers", "https://trpc.io/docs/server/routers"),
            ],
          },
          {
            title: "Next.js Integration",
            type: "READ",
            content:
              "Set up tRPC with Next.js: handler, client config, React Query integration, server-side calls.",
            resources: [doc("tRPC — Next.js", "https://trpc.io/docs/client/nextjs/setup")],
          },
          {
            title: "Move read queries into tRPC procedures",
            type: "BUILD",
            content:
              "Add tRPC to this app and move the curriculum read queries into procedures. Watch the type flow Prisma → tRPC → client with zero casting.",
            resources: [],
          },
          dsaTopic(
            "Trees + binary search trees",
            "Tree traversal (in/pre/post-order) and BST operations.",
            "ch. 3.4–3.5 (binary search trees)"
          ),
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
              "Middleware chaining, context extension, error handling, reusable procedure builders.",
            resources: [doc("tRPC — Middlewares", "https://trpc.io/docs/server/middlewares")],
          },
          {
            title: "Add logging + input validation middleware",
            type: "BUILD",
            content:
              "Add Zod .input() validation to mutating procedures and a middleware that logs every call with timing.",
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
              "Learn the REST-based Upstash Redis SDK: commands, pipelining, differences from traditional Redis clients.",
            resources: [
              doc("Upstash Redis", "https://upstash.com/docs/redis/sdks/ts/overview"),
            ],
          },
          {
            title: "Cache a hot read in Redis",
            type: "BUILD",
            content:
              "Cache the curriculum/dashboard read in Redis with a short TTL; invalidate on mutation. Measure and log the latency delta.",
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
              "Sliding window, token bucket, fixed window — and choosing a strategy per endpoint.",
            resources: [
              doc(
                "Upstash Ratelimit",
                "https://upstash.com/docs/redis/sdks/ratelimit-ts/overview"
              ),
            ],
          },
          {
            title: "Rate-limit the tutor endpoint",
            type: "BUILD",
            content:
              "Apply a sliding-window limit to this app's /api/chat endpoint (e.g. 20 req/min) and surface a typed error gracefully in the UI.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "BMad Spec-Driven Workflow + Advanced Agents",
    description:
      "Apply BMad in TypeScript and push the tutor toward Planner/Executor with memory and MCP.",
    year: 2026,
    month: 11,
    weeks: [
      {
        weekNum: 1,
        title: "Spec-Driven Development",
        topics: [
          {
            title: "Write a BMad Feature Spec",
            type: "EXERCISE",
            content:
              "Write a full BMad spec (.md) for a new feature of this app — e.g. a 'weekly review' assistant — defining problem, solution, data model changes, and API surface before any code.",
            resources: [],
          },
          {
            title: "Derive Code from the Spec",
            type: "BUILD",
            content:
              "Derive Zod schemas, Prisma models, and tRPC signatures directly from the spec. The spec is the source of truth.",
            resources: [],
          },
          dsaTopic(
            "Graphs, BFS/DFS",
            "Adjacency lists, breadth-first and depth-first traversal.",
            "ch. 5.6–5.10 (graph traversal: BFS/DFS)"
          ),
        ],
      },
      {
        weekNum: 2,
        title: "Multi-Agent Patterns + MCP",
        topics: [
          {
            title: "Anthropic Tool Use + AI SDK Agents",
            type: "READ",
            content:
              "Tool definitions, forced/parallel tool use, agent loops. Donner's Agentic Track MCP section maps directly here — and back to the MCP server you tried in June.",
            resources: [
              doc(
                "Anthropic — Tool use",
                "https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
              ),
              VID.agentic(),
            ],
          },
          {
            title: "Build Planner/Executor agents",
            type: "BUILD",
            content:
              "Split the tutor into a Planner (interprets intent → structured plan) and an Executor (calls tools). Wire Planner output into Executor input.",
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
              "Context windowing and summarising older turns to stay within token limits.",
            resources: [
              doc(
                "Anthropic — Long context",
                "https://docs.anthropic.com/en/docs/build-with-claude/long-context-tips"
              ),
            ],
          },
          {
            title: "Add session memory in Redis",
            type: "BUILD",
            content:
              "Store tutor conversation history in Redis keyed by session; summarise older turns before injecting. The tutor should remember earlier discussion.",
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
              "System prompts, role prompting, chain-of-thought, few-shot, XML structure.",
            resources: [
              doc(
                "Anthropic — Prompt engineering",
                "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"
              ),
            ],
          },
          {
            title: "Type and version the prompt templates",
            type: "BUILD",
            content:
              "Refactor this app's src/lib/ai/prompts.ts into typed PromptTemplate functions taking context params; version them alongside the features they serve.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Buffer / Light Month (Holidays)",
    description:
      "December with three kids is chaos — this month is earned slack. Repay slipped weeks, keep DSA warm, rest.",
    year: 2026,
    month: 12,
    isBuffer: true,
    weeks: [
      {
        weekNum: 1,
        title: "Catch-Up",
        topics: [
          {
            title: "Repay slipped weeks",
            type: "EXERCISE",
            content:
              "Finish anything from Jun–Nov that slipped. If you're ahead instead, get a head start on January's infra reading.",
            resources: [],
          },
          dsaTopic(
            "Dynamic programming (intro) + spaced review",
            "Gentle DP intro (memoisation) plus a light review pass over earlier topics.",
            "ch. 10.1–10.2 (dynamic programming intro)"
          ),
        ],
      },
      {
        weekNum: 2,
        title: "Rest + Light Review",
        topics: [
          {
            title: "Spaced repetition pass",
            type: "EXERCISE",
            content:
              "Skim notes and re-quiz yourself on the trickiest topics so far. Keep it light. Rest is part of the plan.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Infra, CI/CD, and Production Hardening",
    description:
      "Deploy this app to production with a real pipeline, tests, and observability.",
    year: 2027,
    month: 1,
    weeks: [
      {
        weekNum: 1,
        title: "Vercel Deployment + Environments",
        topics: [
          {
            title: "Vercel Projects, Deployments & Env Vars",
            type: "READ",
            content:
              "Deployment lifecycle, preview vs prod, and env var scopes (dev/preview/prod) with secret encryption.",
            resources: [
              doc("Vercel — Deployments", "https://vercel.com/docs/deployments/overview"),
              doc(
                "Vercel — Env vars",
                "https://vercel.com/docs/projects/environment-variables"
              ),
            ],
          },
          {
            title: "Deploy this app to Vercel",
            type: "BUILD",
            content:
              "Deploy with three environments wired to separate Neon branches and Upstash instances. Preview deploys auto-wire to the dev Neon branch.",
            resources: [],
          },
          dsaTopic(
            "Sorting + searching",
            "Merge/quick sort intuition and binary search variants.",
            "ch. 4 (sorting & searching)"
          ),
        ],
      },
      {
        weekNum: 2,
        title: "GitHub Actions CI",
        topics: [
          {
            title: "GitHub Actions Workflows",
            type: "READ",
            content:
              "Workflow files, triggers, jobs, steps, caching, reusable workflows.",
            resources: [
              doc(
                "GitHub Actions — Workflows",
                "https://docs.github.com/en/actions/writing-workflows"
              ),
            ],
          },
          {
            title: "Build the CI pipeline",
            type: "BUILD",
            content:
              "CI on every PR: tsc --noEmit, ESLint, prisma migrate diff, and the test suite. Block merges to main on failure.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 3,
        title: "Testing",
        topics: [
          {
            title: "Vitest + Playwright",
            type: "READ",
            content:
              "Vitest unit testing (with mocking) and Playwright e2e (locators, fixtures, assertions).",
            resources: [
              doc("Vitest", "https://vitest.dev/guide/"),
              doc("Playwright", "https://playwright.dev/docs/intro"),
            ],
          },
          {
            title: "Test this app",
            type: "BUILD",
            content:
              "Unit-test the tRPC procedures (mock Prisma) and write two Playwright e2e tests: completing a topic, and a tutor tool-use flow.",
            resources: [],
          },
        ],
      },
      {
        weekNum: 4,
        title: "Observability and Error Handling",
        topics: [
          {
            title: "Log Drains + OpenTelemetry",
            type: "READ",
            content:
              "Vercel log drains and OpenTelemetry tracing (spans, context propagation, instrumentation).",
            resources: [
              doc("Vercel — Log drains", "https://vercel.com/docs/observability/log-drains"),
              doc(
                "OpenTelemetry JS",
                "https://opentelemetry.io/docs/languages/js/getting-started/nodejs/"
              ),
            ],
          },
          {
            title: "Instrument the critical path",
            type: "BUILD",
            content:
              "Add structured logging to procedures and tool calls, trace one critical path with OpenTelemetry, and wire Sentry to the Next.js error boundary.",
            resources: [],
          },
        ],
      },
    ],
  },
  {
    id: 9,
    title: "Consolidation + Portfolio",
    description:
      "Finish, document, and make this app demo-ready. Wrap DSA. Could you demo this in an interview tomorrow?",
    year: 2027,
    month: 2,
    weeks: [
      {
        weekNum: 1,
        title: "Polish the Artifact",
        topics: [
          {
            title: "README, architecture diagram, demo",
            type: "BUILD",
            content:
              "Write a strong README, draw the four-layer architecture diagram, and record a short demo. This is your portfolio piece — make it presentable.",
            resources: [],
          },
          dsaTopic(
            "DP consolidation + full review",
            "Consolidate dynamic programming and do a spaced review across every earlier topic.",
            "ch. 10 (dynamic programming) + Part II catalog"
          ),
        ],
      },
      {
        weekNum: 2,
        title: "Retrospective + Next Steps",
        topics: [
          {
            title: "Write a retrospective",
            type: "EXERCISE",
            content:
              "Write a retro .md: what stuck, what you'd relearn, what's next. Celebrate — you shipped a full-stack AI app, earned AI-900, and built DSA fundamentals while raising three kids.",
            resources: [],
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Date helpers (UTC to keep @db.Date stable across time zones)
// ---------------------------------------------------------------------------
function utc(year: number, month1to12: number, day: number): Date {
  return new Date(Date.UTC(year, month1to12 - 1, day));
}
function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + days);
  return r;
}
function lastDayOfMonth(year: number, month1to12: number): number {
  return new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
}

const defaultPomodoros: Record<TopicType, number> = {
  READ: 2,
  BUILD: 3,
  EXERCISE: 2,
};

// Target weekdays (UTC getUTCDay: Sun=0 … Sat=6). Core work lands
// Mon/Wed/Fri/Sat; DSA lands Tue/Thu. These are resolved to an offset from each
// week's actual start day, so topics hit the intended weekday no matter which
// day of the week the calendar month begins on.
const CORE_DAYS = [1, 3, 5, 6];
const DSA_DAYS = [2, 4];

function offsetToWeekday(weekStart: Date, targetDow: number): number {
  return (targetDow - weekStart.getUTCDay() + 7) % 7;
}

async function main() {
  console.log("Seeding extended 9-month curriculum (Jun 2026 → Feb 2027)…");

  for (const month of curriculum) {
    const monthStart = utc(month.year, month.month, 1);
    const monthEnd = utc(
      month.year,
      month.month,
      lastDayOfMonth(month.year, month.month)
    );

    await prisma.month.upsert({
      where: { id: month.id },
      update: {
        title: month.title,
        description: month.description,
        startDate: monthStart,
        endDate: monthEnd,
        isBuffer: month.isBuffer ?? false,
      },
      create: {
        id: month.id,
        title: month.title,
        description: month.description,
        startDate: monthStart,
        endDate: monthEnd,
        isBuffer: month.isBuffer ?? false,
      },
    });

    for (const week of month.weeks) {
      const weekStart = addDays(monthStart, (week.weekNum - 1) * 7);
      let weekEnd = addDays(weekStart, 6);
      if (weekEnd > monthEnd) weekEnd = monthEnd;

      const weekRecord = await prisma.week.upsert({
        where: { monthId_weekNum: { monthId: month.id, weekNum: week.weekNum } },
        update: { title: week.title, startDate: weekStart, endDate: weekEnd },
        create: {
          monthId: month.id,
          weekNum: week.weekNum,
          title: week.title,
          startDate: weekStart,
          endDate: weekEnd,
        },
      });

      let coreIdx = 0;
      let dsaIdx = 0;

      for (let i = 0; i < week.topics.length; i++) {
        const topic = week.topics[i];
        const track = topic.track ?? "CORE";

        // Assign a concrete study day on the intended weekday within the week.
        let targetDow: number;
        if (track === "DSA") {
          targetDow = DSA_DAYS[dsaIdx % DSA_DAYS.length];
          dsaIdx++;
        } else {
          targetDow = CORE_DAYS[coreIdx % CORE_DAYS.length];
          coreIdx++;
        }
        let scheduledDate = addDays(weekStart, offsetToWeekday(weekStart, targetDow));
        if (scheduledDate > monthEnd) scheduledDate = monthEnd;

        const data = {
          title: topic.title,
          type: topic.type,
          track,
          content: topic.content,
          scheduledDate,
          estimatedPomodoros: defaultPomodoros[topic.type],
        };

        const existing = await prisma.topic.findUnique({
          where: { weekId_sortOrder: { weekId: weekRecord.id, sortOrder: i + 1 } },
        });

        let topicId: number;
        if (existing) {
          await prisma.topic.update({ where: { id: existing.id }, data });
          topicId = existing.id;
          // Replace resources to stay idempotent.
          await prisma.resource.deleteMany({ where: { topicId } });
        } else {
          const created = await prisma.topic.create({
            data: { ...data, weekId: weekRecord.id, sortOrder: i + 1 },
          });
          topicId = created.id;
          await prisma.topicProgress.create({ data: { topicId } });
        }

        if (topic.resources && topic.resources.length > 0) {
          await prisma.resource.createMany({
            data: topic.resources.map((r) => ({
              topicId,
              type: r.type,
              label: r.label,
              url: r.url ?? null,
              source: r.source ?? null,
            })),
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
