import Link from "next/link";
import { getDueReviews } from "@/lib/curriculum/review";
import { monthLabel } from "@/lib/curriculum/schedule";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Spaced-repetition surface: topics whose review is due today (or overdue).
// Renders nothing when the queue is empty.
export async function DueReviews() {
  const due = await getDueReviews();
  if (due.length === 0) return null;

  return (
    <Card className="border-amber-800/50 bg-amber-950/10">
      <CardTitle className="text-base">🔁 Due for review ({due.length})</CardTitle>
      <p className="text-xs text-zinc-500 mt-1 mb-3">
        Spaced recall — the highest-yield few minutes of your day. Re-quiz to
        lock these into long-term memory.
      </p>
      <div className="space-y-2">
        {due.map((t) => (
          <Link
            key={t.id}
            href={`/quiz/${t.id}`}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-zinc-700 px-3 py-2 transition-colors"
          >
            <Badge variant="warning" className="text-[10px]">
              Review
            </Badge>
            <span className="text-sm text-zinc-200 truncate">{t.title}</span>
            <span className="ml-auto text-[10px] text-zinc-500 shrink-0">
              {monthLabel(t.week.month)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
