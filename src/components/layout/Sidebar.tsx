import Link from "next/link";
import { getFullCurriculum } from "@/lib/curriculum/queries";
import { getCurrentTopic } from "@/lib/curriculum/progression";
import { Badge } from "@/components/ui/Badge";
import { STATUS_META, type StatusKey } from "@/lib/curriculum/status";

export async function Sidebar() {
  const curriculum = await getFullCurriculum();
  const currentTopic = await getCurrentTopic();

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-950 overflow-y-auto h-screen sticky top-0">
      <div className="p-4 border-b border-zinc-800">
        <Link href="/" className="text-lg font-bold text-zinc-100">
          LearnTheStack
        </Link>
        <p className="text-xs text-zinc-500 mt-1">9-Month Stack Mastery</p>
      </div>

      <nav className="p-2 border-b border-zinc-800">
        {[
          { href: "/", label: "Dashboard", icon: "▦" },
          { href: "/today", label: "Today", icon: "☀" },
          { href: "/week", label: "This Week", icon: "▤" },
          { href: "/month", label: "Calendar", icon: "▣" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100 rounded-lg transition-colors"
          >
            <span className="text-zinc-500 w-4 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

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
                  const status = (topic.progress?.status ??
                    "NOT_STARTED") as StatusKey;
                  const meta = STATUS_META[status];
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
                      <Badge variant={meta.badge} className="text-[10px] px-1.5 py-0">
                        {meta.icon}
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
