import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

// Shared shape for loading a week with its month and dated, ordered topics.
const weekWithTopicsInclude = {
  month: true,
  topics: {
    orderBy: [{ scheduledDate: "asc" }, { sortOrder: "asc" }],
    include: { progress: true, resources: true },
  },
} satisfies Prisma.WeekInclude;

// ---------------------------------------------------------------------------
// Date helpers. Scheduled dates are stored as @db.Date (UTC midnight), so all
// comparisons and formatting are done in UTC to avoid off-by-one drift.
//
// Two distinct operations, easy to confuse:
//   toUtcDate(now)     — interpret a *local* wall-clock date as UTC midnight
//                        (used once, to turn "now" into today's local day).
//   startOfUtcDay(d)   — strip the time from a date that is ALREADY in UTC
//                        (DB dates, todayUtc()). Idempotent; never localizes.
// Applying toUtcDate to an already-UTC date shifts it back a day for callers
// behind UTC, which is the bug this split avoids.
// ---------------------------------------------------------------------------
export function toUtcDate(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function todayUtc(): Date {
  return toUtcDate(new Date());
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

export function sameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function formatUtc(
  d: Date,
  opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }
): string {
  return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: "UTC" }).format(d);
}

// Consistent month heading across every view: buffer months read "Buffer"
// rather than a numbered "Month N".
export function monthLabel(m: { id: number; isBuffer: boolean }): string {
  return m.isBuffer ? "Buffer" : `Month ${m.id}`;
}

const topicInclude = {
  progress: true,
  resources: true,
  week: { include: { month: true } },
} as const;

// All topics scheduled on a given calendar day.
export async function getDayPlan(date: Date) {
  const day = startOfUtcDay(date);
  const next = addDays(day, 1);
  const topics = await prisma.topic.findMany({
    where: { scheduledDate: { gte: day, lt: next } },
    orderBy: [{ track: "asc" }, { sortOrder: "asc" }],
    include: topicInclude,
  });
  return { date: day, topics };
}

// The week that contains `date`, or the nearest upcoming week if none does.
export async function getWeekForDate(date: Date) {
  const day = startOfUtcDay(date);

  const containing = await prisma.week.findFirst({
    where: { startDate: { lte: day }, endDate: { gte: day } },
    include: weekWithTopicsInclude,
  });
  if (containing) return containing;

  return prisma.week.findFirst({
    where: { startDate: { gte: day } },
    orderBy: { startDate: "asc" },
    include: weekWithTopicsInclude,
  });
}

// Start date of the week immediately before/after the given week start, or null
// at the calendar boundaries. Used to drive (and disable) week navigation.
export async function getPrevWeekStart(weekStart: Date): Promise<Date | null> {
  const w = await prisma.week.findFirst({
    where: { startDate: { lt: startOfUtcDay(weekStart) } },
    orderBy: { startDate: "desc" },
    select: { startDate: true },
  });
  return w?.startDate ?? null;
}

export async function getNextWeekStart(weekStart: Date): Promise<Date | null> {
  const w = await prisma.week.findFirst({
    where: { startDate: { gt: startOfUtcDay(weekStart) } },
    orderBy: { startDate: "asc" },
    select: { startDate: true },
  });
  return w?.startDate ?? null;
}

// Next calendar day (on or after `after`) that has any scheduled topic.
export async function getNextScheduledDate(after: Date): Promise<Date | null> {
  const day = startOfUtcDay(after);
  const t = await prisma.topic.findFirst({
    where: { scheduledDate: { gte: day } },
    orderBy: { scheduledDate: "asc" },
    select: { scheduledDate: true },
  });
  return t?.scheduledDate ?? null;
}

// Full curriculum with dates, tracks, and progress — for the monthly view.
export async function getCurriculumWithSchedule() {
  return prisma.month.findMany({
    orderBy: { id: "asc" },
    include: {
      weeks: {
        orderBy: { weekNum: "asc" },
        include: {
          topics: {
            orderBy: [{ scheduledDate: "asc" }, { sortOrder: "asc" }],
            include: { progress: true },
          },
        },
      },
    },
  });
}
