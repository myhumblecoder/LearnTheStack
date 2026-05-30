"use server";

import { prisma } from "@/lib/db";

export async function startSession(topicId?: number | null) {
  // End any existing open session first
  const existing = await prisma.studySession.findFirst({
    where: { endedAt: null },
  });
  if (existing) {
    await endSession(existing.id);
  }

  return prisma.studySession.create({ data: { topicId: topicId ?? null } });
}

export async function endSession(sessionId: number) {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!session || session.endedAt) return;

  return prisma.studySession.update({
    where: { id: sessionId },
    data: { endedAt: new Date() },
  });
}

// Called when a focus pomodoro completes. Accumulates focused minutes and the
// pomodoro count on the active session.
export async function recordPomodoro(
  sessionId: number,
  focusMinutes: number,
  topicId?: number | null
) {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!session) return;

  return prisma.studySession.update({
    where: { id: sessionId },
    data: {
      pomodoros: { increment: 1 },
      totalMinutes: { increment: focusMinutes },
      ...(topicId ? { topicId } : {}),
    },
  });
}

export async function getActiveSession() {
  return prisma.studySession.findFirst({
    where: { endedAt: null },
    orderBy: { startedAt: "desc" },
  });
}

// Pomodoros and focused minutes completed since local midnight.
export async function getTodayPomodoroStats() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const sessions = await prisma.studySession.findMany({
    where: { startedAt: { gte: startOfDay } },
  });
  return {
    pomodoros: sessions.reduce((sum, s) => sum + s.pomodoros, 0),
    minutes: sessions.reduce((sum, s) => sum + s.totalMinutes, 0),
  };
}
