"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function startTopic(topicId: number) {
  await prisma.topicProgress.upsert({
    where: { topicId },
    update: { status: "IN_PROGRESS", startedAt: new Date() },
    create: { topicId, status: "IN_PROGRESS", startedAt: new Date() },
  });
}

export async function completeTopic(topicId: number) {
  await prisma.topicProgress.upsert({
    where: { topicId },
    update: { status: "COMPLETED", completedAt: new Date() },
    create: {
      topicId,
      status: "COMPLETED",
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });
  revalidatePath("/");
}

export async function setQuizPending(topicId: number) {
  await prisma.topicProgress.upsert({
    where: { topicId },
    update: { status: "QUIZ_PENDING" },
    create: { topicId, status: "QUIZ_PENDING", startedAt: new Date() },
  });
  revalidatePath("/");
  revalidatePath(`/quiz/${topicId}`);
}
