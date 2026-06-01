"use server";

import { prisma } from "@/lib/db";
import { completeTopic } from "./progress";
import { scheduleReview } from "@/lib/curriculum/review";
import { revalidatePath } from "next/cache";

const PASS_THRESHOLD = 70;

export async function submitQuizResult(
  topicId: number,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  feedback: string
) {
  const passed = score >= PASS_THRESHOLD;

  await prisma.quizAttempt.create({
    data: {
      topicId,
      score,
      passed,
      answers: { totalQuestions, correctAnswers, feedback },
    },
  });

  // Spaced repetition: re-taking a passed topic's quiz counts as a review.
  const progress = await prisma.topicProgress.findUnique({ where: { topicId } });
  const alreadyCompleted = progress?.status === "COMPLETED";

  if (passed && !alreadyCompleted) {
    await completeTopic(topicId); // first completion
    await scheduleReview(topicId, true); // enter the review ladder at stage 1
  } else if (alreadyCompleted) {
    await scheduleReview(topicId, passed); // review attempt: advance or drop
  }

  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath(`/quiz/${topicId}`);

  return { passed, score };
}

export async function getQuizAttempts(topicId: number) {
  return prisma.quizAttempt.findMany({
    where: { topicId },
    orderBy: { createdAt: "desc" },
  });
}
