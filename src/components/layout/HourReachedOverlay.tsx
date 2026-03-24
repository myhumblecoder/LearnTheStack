"use client";

import { Button } from "@/components/ui/Button";

interface HourReachedOverlayProps {
  onDismiss: () => void;
}

export function HourReachedOverlay({ onDismiss }: HourReachedOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="text-center space-y-6 px-8">
        <div className="text-6xl">
          <span className="inline-block animate-bounce">&#127881;</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
          1 Hour Reached!
        </h1>
        <p className="text-lg text-zinc-400 max-w-md mx-auto">
          Great session — you showed up and put in the work. Take a break or keep going, your call.
        </p>
        <Button size="lg" onClick={onDismiss}>
          Keep Going
        </Button>
      </div>
    </div>
  );
}
