import Link from "next/link";
import { getFullCurriculum } from "@/lib/curriculum/queries";
import { getCurrentTopic } from "@/lib/curriculum/progression";
import { Badge } from "@/components/ui/Badge";

const statusIcon: Record<string, string> = {
  COMPLETED: "✓",
  IN_PROGRESS: "→",
  QUIZ_PENDING: "?",
  NOT_STARTED: "○",
};

const statusVariant: Record<string, "success" | "info" | "warning" | "muted"> = {
  COMPLETED: "success",
  IN_PROGRESS: "info",
  QUIZ_PENDING: "warning",
  NOT_STARTED: "muted",
};

export async function Sidebar() {
  const curriculum = await getFullCurriculum();
  const currentTopic = await getCurrentTopic();

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-950 overflow-y-auto h-screen sticky top-0">
      <div className="p-4 border-b border-zinc-800">
        <Link href="/" className="text-lg font-bold text-zinc-100">
          LearnTheStack
        </Link>
        <p className="text-xs text-zinc-500 mt-1">6-Month TypeScript Mastery</p>
      </div>

      <nav className="p-2">
        {curriculum.map((month) => (
          <div key={month.id} className="mb-2">
            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Month {month.id}: {month.title}
            </div>
            {month.weeks.map((week) => (
              <div key={week.id} className="ml-2">
                <div className="px-3 py-1 text-xs text-zinc-600">
                  Week {week.weekNum}: {week.title}
                </div>
                {week.topics.map((topic) => {
                  const status = topic.progress?.status ?? "NOT_STARTED";
                  const isCurrent = currentTopic?.id === topic.id;
                  return (
                    <Link
                      key={topic.id}
                      href={`/lesson/${topic.id}`}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md mx-1 transition-colors ${
                        isCurrent
                          ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                      }`}
                    >
                      <Badge variant={statusVariant[status]} className="text-[10px] px-1.5 py-0">
                        {statusIcon[status]}
                      </Badge>
                      <span className="truncate">{topic.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/code-review"
          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Code Review
        </Link>
      </div>
    </aside>
  );
}
