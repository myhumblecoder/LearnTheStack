import Link from "next/link";
import {
  getWeekForDate,
  todayUtc,
  startOfUtcDay,
  addDays,
  formatUtc,
  sameUtcDay,
} from "@/lib/curriculum/schedule";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TopicRow, type TopicRowData } from "@/components/schedule/TopicRow";

export const dynamic = "force-dynamic";

function parseDateParam(s: string | undefined): Date {
  if (s) {
    const [y, m, d] = s.split("-").map(Number);
    if (y && m && d) return new Date(Date.UTC(y, m - 1, d));
  }
  return todayUtc();
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function WeekPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const focus = parseDateParam(date);
  const week = await getWeekForDate(focus);
  const today = todayUtc();

  if (!week) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="text-center py-12">
          <p className="text-zinc-300">No scheduled week found.</p>
          <Link href="/month" className="text-blue-400 text-sm underline">
            View the full calendar
          </Link>
        </Card>
      </div>
    );
  }

  const start = startOfUtcDay(week.startDate);
  const end = startOfUtcDay(week.endDate);

  // Build a bucket per calendar day in the week.
  const days: { date: Date; topics: typeof week.topics }[] = [];
  for (let d = start; d.getTime() <= end.getTime(); d = addDays(d, 1)) {
    const dayTopics = week.topics.filter(
      (t) => t.scheduledDate && sameUtcDay(t.scheduledDate, d)
    );
    days.push({ date: d, topics: dayTopics });
  }

  const completed = week.topics.filter(
    (t) => t.progress?.status === "COMPLETED"
  ).length;

  const prevDate = iso(addDays(start, -1));
  const nextDate = iso(addDays(end, 1));

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-zinc-100">
              Week {week.weekNum}
            </h1>
            <Badge variant="info">
              {formatUtc(start)} – {formatUtc(end)}
            </Badge>
            <Badge variant={completed === week.topics.length ? "success" : "muted"}>
              {completed}/{week.topics.length} done
            </Badge>
          </div>
          <p className="text-sm text-zinc-500">
            Month {week.month.id}: {week.month.title} — {week.title}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <Link href={`/week?date=${prevDate}`}>
            <Button variant="ghost" size="sm">
              ← Prev
            </Button>
          </Link>
          <Link href={`/week?date=${nextDate}`}>
            <Button variant="ghost" size="sm">
              Next →
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {days.map(({ date: d, topics }) => {
          const isToday = sameUtcDay(d, today);
          return (
            <div
              key={d.getTime()}
              className={`rounded-xl border p-4 ${
                isToday
                  ? "border-blue-700 bg-blue-950/20"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-200">
                  {formatUtc(d, { weekday: "long" })}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatUtc(d, { month: "short", day: "numeric" })}
                  {isToday && (
                    <span className="ml-1.5 text-blue-400 font-semibold">
                      today
                    </span>
                  )}
                </span>
              </div>
              {topics.length === 0 ? (
                <p className="text-xs text-zinc-600 italic py-2">
                  Rest / buffer
                </p>
              ) : (
                <div className="space-y-2">
                  {topics.map((t) => (
                    <TopicRow
                      key={t.id}
                      topic={t as unknown as TopicRowData}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href="/today">
          <Button variant="secondary" size="sm">
            ← Today
          </Button>
        </Link>
        <Link href="/month">
          <Button variant="ghost" size="sm">
            Full calendar →
          </Button>
        </Link>
      </div>
    </div>
  );
}
