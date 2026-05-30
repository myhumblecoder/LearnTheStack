"use client";

import { usePomodoro } from "@/components/pomodoro/PomodoroProvider";
import { Button } from "@/components/ui/Button";

export function Header() {
  const {
    mode,
    secondsLeft,
    running,
    pomos,
    sessionActive,
    focusTopic,
    start,
    pause,
    resume,
    skip,
    reset,
  } = usePomodoro();

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const isFocus = mode === "focus";

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between gap-4 px-6">
      <div className="flex items-center gap-2 text-xs min-w-0">
        {focusTopic ? (
          <span className="truncate" title={focusTopic.title}>
            <span className="text-zinc-600">Focusing:</span>{" "}
            <span className="text-zinc-300">{focusTopic.title}</span>
          </span>
        ) : (
          <span className="text-zinc-600">No topic focused</span>
        )}
        {pomos > 0 && (
          <span className="text-zinc-500 shrink-0 tabular-nums">
            · {pomos} 🍅
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${
              isFocus
                ? "border-red-900/60 bg-red-950/40 text-red-300"
                : "border-green-900/60 bg-green-950/40 text-green-300"
            }`}
          >
            {isFocus ? "Focus" : "Break"}
          </span>
          {running && (
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                isFocus ? "bg-red-500" : "bg-green-500"
              }`}
            />
          )}
          <span className="font-mono text-lg text-zinc-100 tabular-nums">
            {pad(mins)}:{pad(secs)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!sessionActive ? (
            <Button size="sm" onClick={() => start()}>
              Start
            </Button>
          ) : running ? (
            <Button size="sm" variant="secondary" onClick={pause}>
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={resume}>
              Resume
            </Button>
          )}
          {sessionActive && (
            <Button size="sm" variant="ghost" onClick={skip}>
              Skip
            </Button>
          )}
          {sessionActive && (
            <Button size="sm" variant="ghost" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
