import Link from "next/link";
import { STATUS_META, type StatusKey } from "@/lib/curriculum/status";

export type { StatusKey };
export type TrackKey = "CORE" | "DSA" | "AZURE" | "CLAUDE_CODE";

export const TRACK_META: Record<
  TrackKey,
  { label: string; icon: string; cls: string }
> = {
  CORE: {
    label: "Core",
    icon: "🧱",
    cls: "bg-blue-900/40 text-blue-300 border-blue-800",
  },
  DSA: {
    label: "DSA",
    icon: "🧮",
    cls: "bg-purple-900/40 text-purple-300 border-purple-800",
  },
  AZURE: {
    label: "Azure",
    icon: "☁️",
    cls: "bg-cyan-900/40 text-cyan-300 border-cyan-800",
  },
  CLAUDE_CODE: {
    label: "Claude Code",
    icon: "🤖",
    cls: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
  },
};

export interface TopicRowData {
  id: number;
  title: string;
  type: string;
  track: TrackKey;
  estimatedPomodoros: number;
  progress: { status: StatusKey } | null;
}

export function TopicRow({
  topic,
  compact = false,
}: {
  topic: TopicRowData;
  compact?: boolean;
}) {
  const status = (topic.progress?.status ?? "NOT_STARTED") as StatusKey;
  const t = TRACK_META[topic.track];
  const s = STATUS_META[status];

  return (
    <Link
      href={`/lesson/${topic.id}`}
      className="block rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 hover:border-zinc-700 p-3 transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${t.cls}`}
        >
          <span>{t.icon}</span>
          {!compact && <span>{t.label}</span>}
        </span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
          {topic.type}
        </span>
        <span
          className="text-[10px] leading-none"
          title={`${topic.estimatedPomodoros} pomodoro${topic.estimatedPomodoros === 1 ? "" : "s"}`}
        >
          {"🍅".repeat(topic.estimatedPomodoros)}
        </span>
        <span className={`ml-auto text-xs font-bold ${s.textCls}`}>{s.icon}</span>
      </div>
      <div className="text-sm text-zinc-200 leading-snug">{topic.title}</div>
    </Link>
  );
}
