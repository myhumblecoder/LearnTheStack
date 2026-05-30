"use client";

import { usePomodoro } from "@/components/pomodoro/PomodoroProvider";
import { Button } from "@/components/ui/Button";

export function FocusButton({
  topicId,
  title,
}: {
  topicId: number;
  title: string;
}) {
  const { start, focusTopic, sessionActive, running } = usePomodoro();
  const isCurrent = sessionActive && focusTopic?.id === topicId;

  return (
    <Button
      size="sm"
      variant={isCurrent && running ? "secondary" : "primary"}
      onClick={() => start({ id: topicId, title })}
      title="Start a 25-minute pomodoro focused on this topic"
    >
      {isCurrent ? "↻ Restart focus" : "🍅 Focus this topic"}
    </Button>
  );
}
