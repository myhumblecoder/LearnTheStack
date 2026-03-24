"use server";

import { prisma } from "@/lib/db";

export async function startSession() {
  // End any existing open session first
  const existing = await prisma.studySession.findFirst({
    where: { endedAt: null },
  });
  if (existing) {
    await endSession(existing.id);
  }

  return prisma.studySession.create({ data: {} });
}

export async function endSession(sessionId: number) {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!session || session.endedAt) return;

  const totalMinutes = Math.round(
    (Date.now() - session.startedAt.getTime()) / 60000
  );

  return prisma.studySession.update({
    where: { id: sessionId },
    data: { endedAt: new Date(), totalMinutes },
  });
}

export async function heartbeatSession(sessionId: number) {
  const session = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!session || session.endedAt) return;

  const totalMinutes = Math.round(
    (Date.now() - session.startedAt.getTime()) / 60000
  );

  return prisma.studySession.update({
    where: { id: sessionId },
    data: { totalMinutes },
  });
}

export async function getActiveSession() {
  return prisma.studySession.findFirst({
    where: { endedAt: null },
    orderBy: { startedAt: "desc" },
  });
}
