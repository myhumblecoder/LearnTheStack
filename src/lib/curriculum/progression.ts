import { prisma } from "@/lib/db";

export async function getCurrentTopic() {
  const topic = await prisma.topic.findFirst({
    where: {
      OR: [
        { progress: null },
        { progress: { status: { not: "COMPLETED" } } },
      ],
    },
    orderBy: [
      { week: { month: { id: "asc" } } },
      { week: { weekNum: "asc" } },
      { sortOrder: "asc" },
    ],
    include: {
      progress: true,
      week: { include: { month: true } },
    },
  });
  return topic;
}

export async function canAccessTopic(topicId: number): Promise<boolean> {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      week: { include: { month: true } },
    },
  });
  if (!topic) return false;

  // First topic is always accessible
  const allTopics = await prisma.topic.findMany({
    orderBy: [
      { week: { month: { id: "asc" } } },
      { week: { weekNum: "asc" } },
      { sortOrder: "asc" },
    ],
    include: { progress: true },
  });

  const topicIndex = allTopics.findIndex((t) => t.id === topicId);
  if (topicIndex === 0) return true;

  // Previous topic must be completed
  const prevTopic = allTopics[topicIndex - 1];
  return prevTopic.progress?.status === "COMPLETED";
}

export async function getNextTopic(currentTopicId: number) {
  const allTopics = await prisma.topic.findMany({
    orderBy: [
      { week: { month: { id: "asc" } } },
      { week: { weekNum: "asc" } },
      { sortOrder: "asc" },
    ],
    include: {
      progress: true,
      week: { include: { month: true } },
    },
  });

  const currentIndex = allTopics.findIndex((t) => t.id === currentTopicId);
  if (currentIndex === -1 || currentIndex >= allTopics.length - 1) return null;
  return allTopics[currentIndex + 1];
}
