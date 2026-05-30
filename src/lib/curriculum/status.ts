// Single source of truth for topic-progress status presentation, shared by the
// sidebar (Badge variant) and the schedule rows (text colour).

export type StatusKey =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "QUIZ_PENDING"
  | "COMPLETED";

export const STATUS_META: Record<
  StatusKey,
  {
    icon: string;
    badge: "success" | "info" | "warning" | "muted";
    textCls: string;
  }
> = {
  COMPLETED: { icon: "✓", badge: "success", textCls: "text-green-400" },
  IN_PROGRESS: { icon: "→", badge: "info", textCls: "text-blue-400" },
  QUIZ_PENDING: { icon: "?", badge: "warning", textCls: "text-yellow-400" },
  NOT_STARTED: { icon: "○", badge: "muted", textCls: "text-zinc-600" },
};
