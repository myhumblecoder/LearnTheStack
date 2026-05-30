import Link from "next/link";
import { getCurriculumWithSchedule, formatUtc, monthLabel } from "@/lib/curriculum/schedule";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TRACK_META, type TrackKey } from "@/components/schedule/TopicRow";

export const dynamic = "force-dynamic";

const TRACK_ORDER: TrackKey[] = ["CORE", "DSA", "AZURE", "CLAUDE_CODE"];

export default async function MonthPage() {
  const months = await getCurriculumWithSchedule();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Calendar</h1>
        <p className="text-sm text-zinc-500">
          The full 9-month plan · Jun 2026 → Feb 2027 · ~10 hrs/week
        </p>
      </div>

      {months.map((month) => {
        const topics = month.weeks.flatMap((w) => w.topics);
        const total = topics.length;
        const completed = topics.filter(
          (t) => t.progress?.status === "COMPLETED"
        ).length;

        const trackCounts = TRACK_ORDER.map((key) => ({
          key,
          count: topics.filter((t) => t.track === key).length,
        })).filter((x) => x.count > 0);

        return (
          <Card
            key={month.id}
            className={month.isBuffer ? "border-amber-800/50 bg-amber-950/10" : ""}
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <CardTitle className="text-base">
                {monthLabel(month)}: {month.title}
              </CardTitle>
              <div className="flex items-center gap-2 shrink-0">
                {month.isBuffer && <Badge variant="warning">🎄 holidays</Badge>}
                <Badge variant={completed === total && total > 0 ? "success" : "muted"}>
                  {completed}/{total}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mb-2">
              {formatUtc(month.startDate, {
                month: "short",
                day: "numeric",
              })}{" "}
              –{" "}
              {formatUtc(month.endDate, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <p className="text-sm text-zinc-400 mb-3">{month.description}</p>

            <ProgressBar
              value={completed}
              max={total || 1}
              color={completed === total && total > 0 ? "bg-green-600" : "bg-blue-600"}
            />

            {trackCounts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {trackCounts.map(({ key, count }) => {
                  const t = TRACK_META[key];
                  return (
                    <span
                      key={key}
                      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${t.cls}`}
                    >
                      {t.icon} {t.label} · {count}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="mt-4 space-y-1.5">
              {month.weeks.map((week) => {
                const wDone = week.topics.filter(
                  (t) => t.progress?.status === "COMPLETED"
                ).length;
                return (
                  <Link
                    key={week.id}
                    href={`/week?date=${week.startDate.toISOString().slice(0, 10)}`}
                    className="flex items-center justify-between text-xs rounded-md px-2 py-1.5 hover:bg-zinc-800/60 transition-colors"
                  >
                    <span className="text-zinc-300">
                      <span className="text-zinc-500">W{week.weekNum}</span>{" "}
                      {week.title}
                    </span>
                    <span className="text-zinc-500 shrink-0 ml-2">
                      {formatUtc(week.startDate, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {wDone}/{week.topics.length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
