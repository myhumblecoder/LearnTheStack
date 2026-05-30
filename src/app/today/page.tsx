import Link from "next/link";
import {
  getDayPlan,
  getNextScheduledDate,
  todayUtc,
  formatUtc,
  sameUtcDay,
  monthLabel,
} from "@/lib/curriculum/schedule";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TopicRow } from "@/components/schedule/TopicRow";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const today = todayUtc();
  let plan = await getDayPlan(today);
  let isToday = true;

  if (plan.topics.length === 0) {
    const nextDate = await getNextScheduledDate(today);
    if (nextDate) {
      plan = await getDayPlan(nextDate);
      isToday = sameUtcDay(plan.date, today);
    }
  }

  const topics = plan.topics;
  const totalPomodoros = topics.reduce(
    (sum, t) => sum + t.estimatedPomodoros,
    0
  );
  const context = topics[0]?.week;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-zinc-100">
            {isToday ? "Today" : "Next study day"}
          </h1>
          <Badge variant={isToday ? "info" : "muted"}>
            {formatUtc(plan.date, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
        {context && (
          <p className="text-sm text-zinc-500">
            {monthLabel(context.month)}: {context.month.title} · Week{" "}
            {context.weekNum} — {context.title}
          </p>
        )}
      </div>

      {topics.length === 0 ? (
        <Card className="text-center py-12 border-green-800 bg-green-950/20">
          <p className="text-lg text-zinc-200 mb-1">Nothing left on the calendar 🎉</p>
          <p className="text-sm text-zinc-400">
            You&apos;ve reached the end of the plan — time to ship the portfolio.
          </p>
        </Card>
      ) : (
        <>
          {!isToday && (
            <Card className="border-zinc-700 bg-zinc-900/40 py-3">
              <p className="text-sm text-zinc-400">
                Nothing is scheduled for today — here&apos;s your next study day.
                On a wrecked day, the rule is{" "}
                <span className="text-zinc-200">never zero</span>: do one
                pomodoro to keep the streak.
              </p>
            </Card>
          )}

          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>
              {topics.length} topic{topics.length === 1 ? "" : "s"}
            </span>
            <span aria-hidden>·</span>
            <span>
              {"🍅".repeat(Math.min(totalPomodoros, 12))}{" "}
              <span className="text-zinc-500">
                ~{totalPomodoros} pomodoros (~
                {Math.round((totalPomodoros * 25) / 6) / 10} hrs focus)
              </span>
            </span>
          </div>

          <div className="space-y-2">
            {topics.map((t) => (
              <TopicRow key={t.id} topic={t} />
            ))}
          </div>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <p className="text-sm text-zinc-300 mb-1 font-medium">
              How to run the day
            </p>
            <p className="text-xs text-zinc-500">
              Use the pomodoro timer in the top bar (25 min focus / 5 min break).
              Protect the build pomodoros first; DSA and review flex when life
              intervenes. Open a topic to study with the AI tutor.
            </p>
          </Card>

          <div className="flex gap-3">
            <Link href="/week">
              <Button variant="secondary" size="sm">
                See the week →
              </Button>
            </Link>
            <Link href="/month">
              <Button variant="ghost" size="sm">
                Full calendar
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
