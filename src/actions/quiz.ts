"use server";

import { prisma } from "@/lib/db";
import { completeTopic } from "./progress";
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

  if (passed) {
    await completeTopic(topicId);
  }

  revalidatePath("/");
  revalidatePath(`/quiz/${topicId}`);

  return { passed, score };
}

export async function getQuizAttempts(topicId: number) {
  return prisma.quizAttempt.findMany({
    where: { topicId },
    orderBy: { createdAt: "desc" },
  });
}
