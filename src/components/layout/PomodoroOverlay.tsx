"use client";

import { Button } from "@/components/ui/Button";

interface PomodoroOverlayProps {
  title: string;
  message: string;
  cta?: string;
  onDismiss: () => void;
}

export function PomodoroOverlay({
  title,
  message,
  cta = "Got it",
  onDismiss,
}: PomodoroOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="text-center space-y-6 px-8">
        <div className="text-6xl">
          <span className="inline-block animate-bounce">🍅</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-lg text-zinc-400 max-w-md mx-auto">{message}</p>
        <Button size="lg" onClick={onDismiss}>
          {cta}
        </Button>
      </div>
    </div>
  );
}
