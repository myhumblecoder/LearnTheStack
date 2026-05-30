# LearnTheStack — Extended Plan (Jun 2026 → Feb 2027)

> An extension of [`studyplan.md`](./studyplan.md) for a mid-level developer with a
> full-time job and three kids. ~10 hrs/week. Adds three tracks around the original
> 6-month spine: **Claude Code**, **Azure AI-900 (cert)**, and **DSA (fundamentals)**.

**Start:** Mon Jun 1 2026 · **End:** Sun Feb 28 2027 · **Pace:** ~10 hrs/week · **9 calendar months**

---

## The reality this plan is built around

You will have weeks where a kid is sick, work explodes, and you study zero hours. **That's
expected and the plan is built to absorb it.** Three rules make it survivable:

1. **The spine is sacred; the tracks are elastic.** When a week collapses, you protect the
   LearnTheStack core (Track A) and let DSA / Azure / Claude Code slip. Never the reverse.
2. **Anchor sessions to life events, not clock times.** "30 min before the house wakes up,"
   "lunch break Tue/Thu," "after bedtime Sun" — not "7:00 PM sharp." Anchored habits survive
   chaos; scheduled ones don't.
3. **Never zero.** On a wrecked day, do **one pomodoro** (25 min). A single tomato keeps the
   streak and the mental model alive. Momentum > volume.

---

## Your resource library

The plan is **resource-aware** — every task points at something you already own. Three media,
three jobs:

- 📖 **Docs** = the source of truth. Per the project philosophy, official docs beat tutorials. Read these to be *correct*.
- 🎥 **Video courses** = scaffolding and intuition. Watch these to get *unstuck* and build a mental model fast.
- 📚 **Textbooks** = depth and reference. Read these to go *deep* on fundamentals that don't change.

### 🎥 Video courses (owned)

| Course | Instructor | Used in |
|---|---|---|
| TypeScript: The Complete Developer's Guide | Stephen Grider | Jun (M1) |
| Claude Code: Building Faster with AI, Prototype to Prod | Frank Kane | Jun on-ramp |
| AI Engineer Agentic Track: Agent & MCP | Ed Donner | Aug, Oct, Nov (M3/M5/M6) |
| AI-900: Azure AI Fundamentals in a Weekend | in28Minutes | Sep (M4) |
| Master the Coding Interview: DS & Algorithms | Andrei Neagoie | All months (Track B) |

### 📖 Docs (primary reference)
The bookmark table in [`studyplan.md`](./studyplan.md#reference-key-docs-bookmarks) — Next.js,
TypeScript, Zod, Prisma, Neon, Vercel AI SDK, Anthropic, tRPC, Upstash, Vercel, GitHub Actions,
Vitest, Playwright. Plus [Microsoft Learn — AI-900](https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/) for the cert.

### 📚 Textbooks (you tell me)
> _Add the titles you own and I'll slot them into the relevant months. Likely candidates given
> the stack: a TypeScript reference (e.g. *Programming TypeScript*), a DSA text (e.g. *Grokking
> Algorithms* or *The Algorithm Design Manual*), a systems/AI text. **Tell me what's on your
> shelf and I'll wire each chapter to a week.**_

---

## Three views

### 🗓️ Monthly view (the spine)

| Month | Dates | Focus | Track B (DSA) | Artifact |
|---|---|---|---|---|
| **1** | **Jun 1 – Jun 30** | Next.js + TS + Claude Code on-ramp *(Core M1)* | Big-O, arrays, hash maps | Typed routes, Server Actions, Zod forms, in-memory CRUD |
| **2** | **Jul 1 – Jul 31** | Data layer: Prisma + Neon *(Core M2)* | Two pointers, sliding window | Full persistence in Neon |
| **3** | **Aug 1 – Aug 31** | Agent layer: Vercel AI SDK + Anthropic *(Core M3)* | Stacks, queues, linked lists | AI assistant tab w/ tool calls |
| **4** | **Sep 1 – Sep 30** | 🎯 **Azure AI-900 cert sprint** *(NEW)* | Recursion (light) | **AI-900 cert** + Azure↔stack note |
| **5** | **Oct 1 – Oct 31** | API layer: tRPC + Redis *(Core M4)* | Trees + BSTs | Hardened API, cached + rate-limited |
| **6** | **Nov 1 – Nov 30** | BMad spec-driven + advanced agents *(Core M5)* | Graphs, BFS/DFS | Planner/Executor agent pair |
| **—** | **Dec 1 – Dec 31** | 🎄 **Buffer / light month** *(holidays)* | DP intro + spaced review | Repay slipped weeks; rest |
| **7** | **Jan 1 – Jan 31** | Infra, CI/CD, production *(Core M6)* | Sorting + searching | Deployed, CI-gated, observable app |
| **8** | **Feb 1 – Feb 28** | Consolidation + portfolio *(NEW)* | DP consolidation + full review | Documented, demo-ready full stack |

> **Why December is the buffer:** holidays are chaos with three kids. Don't fight it — the
> calendar gives you a built-in recovery month exactly when you need it. If you're *ahead*
> by December, use it to get to DP early; if behind, it's where everything catches up.

### 📅 Weekly view (repeating template)

Each month follows the original plan's Week 1–4 structure. Example — **Month 1, June 2026**:

| Week | Dates | Core stack (Track A) | DSA (Track B) |
|---|---|---|---|
| W1 | **Jun 1 – Jun 7** | App Router internals + **Claude Code on-ramp** | Big-O notation |
| W2 | **Jun 8 – Jun 14** | Server Actions (CRUD, in-memory) | Arrays + strings |
| W3 | **Jun 15 – Jun 21** | TypeScript at depth (generics, conditional types) | Hash maps |
| W4 | **Jun 22 – Jun 28** | Zod foundations (infer types, refinements) | Review + 1 mixed set |
| (W5) | Jun 29 – Jun 30 | Spillover / buffer | — |

Months with a 5th partial week (Jul, Aug, Oct, Jan) use it as **catch-up/buffer** — never new material.

### ⏱️ Daily view (pomodoro-structured)

A pomodoro = **25 min focused work + 5 min break**; long break (15–20 min) after 4. Your ~10 hrs/week maps to **~20 pomodoros**, distributed to survive a parent's schedule:

| Day | Anchor | Blocks | Pomodoros |
|---|---|---|---|
| **Mon** | Before house wakes | 🍅 read docs → ☕ → 🍅 build | 2 |
| **Tue** | Lunch break | 🍅 DSA concept → finish 1 problem | 1–2 |
| **Wed** | Before house wakes | 🍅 read docs → ☕ → 🍅 build | 2 |
| **Thu** | Lunch break | 🍅 DSA → 1 problem | 1–2 |
| **Fri** | Before house wakes | 🍅 read docs → ☕ → 🍅 build | 2 |
| **Sat** | Nap time / morning | 🍅 → ☕ → 🍅 → ☕ → 🍅 (week's build block) | 3 |
| **Sun** | After bedtime | 🍅 review week → ☕ → 🍅 Claude Code tinker + plan next week | 2 |

**The 4 weekday "build" pomodoros are the spine** — protect those first. DSA, Saturday's block,
and Sunday review are the elastic parts that flex when life intervenes.

**Standard build pomodoro pair:**
```
🍅 Pom 1 (25m)  Read the day's doc / watch the course segment — eyes on source
☕ Break (5m)    Stand up, refill coffee, NO screens
🍅 Pom 2 (25m)  Apply it in the repo — write the code, with Claude Code as pair
☕ Break (5m)    Done. Log one line: "what I learned / what's still fuzzy"
```

---

## Track C — Claude Code on-ramp (Jun 1 – Jun 14, then ambient)

You're already building this app *with* Claude Code, so front-load Kane's course in the first
two weeks and make every later month faster. Highest-leverage fortnight in the plan.

- 🎥 Frank Kane — *Claude Code: Prototype to Prod*
- **Build (on this repo):** refine `CLAUDE.md`; add one **slash command** (e.g. "scaffold a tRPC procedure from a Zod schema"); add one **hook** (run `tsc --noEmit` after edits); connect one **MCP server**.
- **Ambient after:** every month's "Build" is done *with* Claude Code as a pair. Where it needs tighter specs feeds Month 6's BMad work directly.

**Artifact:** A tuned Claude Code setup you use daily.

---

## Track D — Azure AI-900 (September, exam wk of Sep 21–27)

AI-900 is a fundamentals cert — broad, conceptual, low-code. It earns its own month as a
**change of pace** right after the agent layer, deepening your "what is AI/ML" mental model.

> ⚠️ **Off-stack:** Azure isn't part of LearnTheStack (you run Vercel + Neon + Upstash +
> Anthropic). AI-900 is a credential/breadth play — a self-contained sprint, not interleaved.

**September week-by-week:**
| Week | Dates | Work |
|---|---|---|
| W1 | Sep 1 – Sep 6 | 🎥 in28Minutes course, first half + notes |
| W2 | Sep 7 – Sep 13 | 🎥 course second half; 📖 Microsoft Learn AI-900 path |
| W3 | Sep 14 – Sep 20 | Hands-on in free Azure portal — Cognitive Services, Azure OpenAI, AI Foundry. Map each to its Anthropic/Vercel equivalent. |
| W4 | **Sep 21 – Sep 27** | 2–3 timed practice exams (aim 85%+), then **sit the exam.** |

**Artifact:** **AI-900 certification** + a one-page "Azure AI ↔ my stack" comparison note.

---

## Detailed monthly notes

Each core month links to the matching section of the original plan; the supplements and DSA
focus are layered on top.

- **Jun (M1)** — [Core M1](./studyplan.md#month-1--nextjs-app-router--typescript-foundations) + Claude Code on-ramp. 🎥 Grider TS pairs here.
- **Jul (M2)** — [Core M2](./studyplan.md#month-2--data-layer-prisma--postgresql--neon).
- **Aug (M3)** — [Core M3](./studyplan.md#month-3--agent-layer-vercel-ai-sdk--anthropic). 🎥 Begin Donner's Agentic Track — **take the concepts, re-implement in your TS/Anthropic stack** (course leans Python/OpenAI).
- **Sep (M4)** — Azure AI-900 sprint (above). Core paused — deliberate breather.
- **Oct (M5)** — [Core M4](./studyplan.md#month-4--api-layer-trpc--rate-limiting--caching). 🎥 Continue Agentic Track (tool-calling patterns).
- **Nov (M6)** — [Core M5](./studyplan.md#month-5--bmad-spec-driven-workflow--advanced-agent-patterns). 🎥 Finish Agentic Track — **MCP** section maps to multi-agent + memory work, and back to your Claude Code MCP experiment.
- **Dec** — Buffer. DP intro + spaced DSA review. Rest. Repay slipped weeks.
- **Jan (M7)** — [Core M6](./studyplan.md#month-6--infra-cicd-and-production-hardening).
- **Feb (M8)** — Consolidation: catch-up, polish the artifact (README, architecture diagram, demo), DP + full DSA review, retrospective `.md`. **Artifact:** finished, documented, deployed app + DSA repo + AI-900 cert.

---

## Quarterly checkpoints

- **End of Aug (Q1):** Core agent layer working, Claude Code tuned, DSA habit set. *Am I building daily?*
- **End of Sep (cert):** AI-900 in hand. *Is the spine still healthy, or did the cert eat it?*
- **End of Nov (Q2):** Advanced agents shipped. *Is the app runnable every month?*
- **End of Feb (Q3 / done):** Everything documented and deployed. *Could I demo this in an interview tomorrow?*

---

## What I deliberately did NOT do

- **Didn't interleave Azure into the stack months** — off-stack; a focused September sprint + clean breather beats diluting both.
- **Didn't put DSA on a deadline** — you asked for fundamentals. If a job hunt appears, promote DSA to a front-loaded intensive (a different plan).
- **Didn't fill all 10 hours or all 7 days** — the buffer pomodoro and December are features. A no-slack plan is the one a parent of 3 abandons in week 3.
