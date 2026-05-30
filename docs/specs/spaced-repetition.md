# Spec: Spaced Repetition (Due-for-Review)

> BMad spec — written before code, per the project's docs-first philosophy.

## Problem

The app's quizzes are **one-and-done**: you pass a topic's quiz once, it's marked
`COMPLETED`, and you never see it again. The two highest-utility learning techniques
(Dunlosky et al. 2013) are **retrieval practice** and **spaced/distributed practice** — and
the current flow captures the first only once and the second not at all. Knowledge passed in
June is gone by September with nothing prompting a refresh.

## Goal

After you pass a topic's quiz, the app **resurfaces that quiz at expanding intervals** and tells
you each day what's **due for review** — turning the lean schedule's otherwise-empty flex days
(Tue/Thu/weekends) into short, high-yield recall sessions.

Non-goals (this iteration): a full SM-2/Anki algorithm, per-question scheduling, notifications,
or changing how *new* topics are scheduled.

## Solution overview

Re-taking a passed topic's quiz **is** a review. Every attempt already routes through one server
action (`submitQuizResult`), so we make that action **spacing-aware** and add a **"Due for
review"** surface that links back into it. No new quiz UI or AI changes.

### Interval ladder

`reviewStage` (1-based) → fixed expanding interval in days:

| Stage | Interval |
|---|---|
| 1 | +3 days |
| 2 | +7 days |
| 3 | +21 days |
| 4 | +60 days |
| 5 (max) | +120 days |

- First pass → complete the topic, enter at **stage 1** (`nextReviewAt = today + 3d`).
- Review pass → advance one stage (capped at 5).
- Review fail → drop one stage (floored at 1), resurface sooner.
- A failed quiz on a not-yet-completed topic changes nothing.

Fixed intervals (not SM-2) are deliberate: simpler and debuggable; the win is *any* expanding
schedule vs. none.

## Data model

Two fields on `TopicProgress` (non-destructive; existing rows default to "not scheduled"):

```prisma
reviewStage  Int       @default(0)   // 0 = not in the review ladder
nextReviewAt DateTime? @db.Date       // null = nothing scheduled
```

`status` stays the source of truth for completion.

## Surfaces

- **`/today`** — a "🔁 Due for review" section above the day's new topics; each row links to
  `/quiz/[topicId]`. Primary surface; fills the lean schedule's flex days.
- **Dashboard (`/`)** — same component, at-a-glance.
- Empty state: render nothing when nothing is due.

## Logic

- `src/lib/curriculum/review.ts` — `intervalForStage`, `scheduleReview(topicId, passed)`,
  `getDueReviews(date?)`. Reuses the UTC date helpers in `schedule.ts`.
- `src/actions/quiz.ts` — `submitQuizResult` calls `scheduleReview` after recording the attempt
  (first pass → `completeTopic` + enter ladder; already completed → advance/drop).
- `src/components/schedule/DueReviews.tsx` — async server component used by `/today` and `/`.

## Acceptance criteria

1. First pass sets `reviewStage = 1`, `nextReviewAt = today + 3d`.
2. A topic with `nextReviewAt <= today` appears in "Due for review" on `/today` and the dashboard.
3. Re-passing a due review advances the stage and pushes `nextReviewAt` out.
4. Failing a review drops the stage (min 1) and brings `nextReviewAt` closer.
5. Nothing due → the section renders nothing.
6. `tsc --noEmit` and ESLint clean; first-pass completion behavior unchanged.

## Future (out of scope)

SM-2 ease factors, per-question scheduling, a dedicated `/review` page batching all due items,
and review streaks.
