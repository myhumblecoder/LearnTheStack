"use server";

import { prisma } from "@/lib/db";

export type Rating = "UP" | "DOWN";

export async function rateMessage(
  externalId: string,
  rating: Rating | null,
  reason?: string
) {
  const message = await prisma.chatMessage.findUnique({
    where: { externalId },
    select: { id: true },
  });
  if (!message) return { ok: false as const, error: "Message not found" };

  if (rating === null) {
    await prisma.messageFeedback.deleteMany({ where: { messageId: message.id } });
    return { ok: true as const };
  }

  await prisma.messageFeedback.upsert({
    where: { messageId: message.id },
    update: { rating, reason: reason ?? null },
    create: { messageId: message.id, rating, reason: reason ?? null },
  });
  return { ok: true as const };
}
