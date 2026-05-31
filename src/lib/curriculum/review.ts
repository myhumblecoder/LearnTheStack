import { prisma } from "@/lib/db";
import { todayUtc, addDays, startOfUtcDay } from "./schedule";

// Expanding spaced-repetition intervals (days), indexed by 1-based review stage.
// Stage 0 = not yet in the ladder. See docs/specs/spaced-repetition.md.
const INTERVALS = [0, 3, 7, 21, 60, 120];
const MAX_STAGE = INTERVALS.length - 1; // 5

export function intervalForStage(stage: number): number {
  return INTERVALS[Math.min(Math.max(stage, 1), MAX_STAGE)];
}

/**
 * Update a topic's review schedule after a quiz attempt.
 * - first entry (stage 0) + pass → stage 1
 * - pass while the review is DUE → advance one stage (capped at MAX_STAGE)
 * - pass while NOT yet due → no change (re-taking early doesn't fast-forward
 *   the ladder; that would defeat spacing)
 * - fail → drop one stage (floored at 1)
 * A fail at stage 0 (topic not yet in the ladder) is a no-op.
 *
 * Uses upsert so the helper is safe to call even if no TopicProgress row
 * exists yet (matches the pattern in src/actions/progress.ts).
 */
export async function scheduleReview(topicId: number, passed: boolean) {
  const progress = await prisma.topicProgress.findUnique({ where: { topicId } });
  const current = progress?.reviewStage ?? 0;
  const today = todayUtc();

  let stage: number;
  if (current === 0) {
    if (!passed) return; // not in the ladder yet, failed → nothing to schedule
    stage = 1;
  } else if (passed) {
    const due =
      progress?.nextReviewAt != null &&
      startOfUtcDay(progress.nextReviewAt).getTime() <= today.getTime();
    if (!due) return; // re-passed before it was due → don't advance the ladder
    stage = Math.min(current + 1, MAX_STAGE);
  } else {
    stage = Math.max(current - 1, 1); // fail drops a stage regardless of due-ness
  }

  const nextReviewAt = addDays(today, intervalForStage(stage));

  await prisma.topicProgress.upsert({
    where: { topicId },
    update: { reviewStage: stage, nextReviewAt },
    create: { topicId, reviewStage: stage, nextReviewAt },
  });
}

// Completed topics whose next review is due on/before `date`, soonest first.
export async function getDueReviews(date: Date = todayUtc()) {
  const day = startOfUtcDay(date);
  return prisma.topic.findMany({
    where: {
      progress: {
        status: "COMPLETED",
        nextReviewAt: { not: null, lte: day },
      },
    },
    orderBy: [{ progress: { nextReviewAt: "asc" } }],
    include: {
      progress: true,
      week: { include: { month: true } },
    },
  });
}
