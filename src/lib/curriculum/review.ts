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
 * - pass → advance one stage (capped at MAX_STAGE)
 * - fail → drop one stage (floored at 1)
 * A fail at stage 0 (topic not yet completed) is a no-op.
 */
export async function scheduleReview(topicId: number, passed: boolean) {
  const progress = await prisma.topicProgress.findUnique({ where: { topicId } });
  const current = progress?.reviewStage ?? 0;

  let stage: number;
  if (current === 0) {
    if (!passed) return; // not in the ladder yet, failed → nothing to schedule
    stage = 1;
  } else {
    stage = passed
      ? Math.min(current + 1, MAX_STAGE)
      : Math.max(current - 1, 1);
  }

  await prisma.topicProgress.update({
    where: { topicId },
    data: {
      reviewStage: stage,
      nextReviewAt: addDays(todayUtc(), intervalForStage(stage)),
    },
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
