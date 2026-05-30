import { prisma } from "@/lib/db";

export async function getFullCurriculum() {
  return prisma.month.findMany({
    orderBy: { id: "asc" },
    include: {
      weeks: {
        orderBy: { weekNum: "asc" },
        include: {
          topics: {
            orderBy: { sortOrder: "asc" },
            include: { progress: true },
          },
        },
      },
    },
  });
}

export async function getTopic(topicId: number) {
  return prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      progress: true,
      resources: true,
      week: {
        include: {
          month: true,
        },
      },
    },
  });
}

export async function getTopicWithMessages(topicId: number, mode: string) {
  const topic = await getTopic(topicId);
  const messages = await prisma.chatMessage.findMany({
    where: { topicId, mode: mode as "LESSON" | "QUIZ" | "CODE_REVIEW" },
    orderBy: { createdAt: "asc" },
  });
  return { topic, messages };
}

export async function getChatMessages(topicId: number | null, mode: string) {
  return prisma.chatMessage.findMany({
    where: { topicId, mode: mode as "LESSON" | "QUIZ" | "CODE_REVIEW" },
    orderBy: { createdAt: "asc" },
    include: { feedback: true },
  });
}

export async function saveChatMessage(data: {
  topicId: number | null;
  mode: "LESSON" | "QUIZ" | "CODE_REVIEW";
  role: string;
  content: string;
  externalId?: string;
}) {
  return prisma.chatMessage.create({ data });
}

export async function getProgressStats() {
  const topics = await prisma.topic.findMany({
    include: { progress: true },
  });
  const total = topics.length;
  const completed = topics.filter(
    (t) => t.progress?.status === "COMPLETED"
  ).length;
  const inProgress = topics.filter(
    (t) =>
      t.progress?.status === "IN_PROGRESS" ||
      t.progress?.status === "QUIZ_PENDING"
  ).length;
  return { total, completed, inProgress };
}

export async function getRecentQuizAttempts(limit = 5) {
  return prisma.quizAttempt.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      topic: {
        include: {
          week: { include: { month: true } },
        },
      },
    },
  });
}
