"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  startSession,
  endSession,
  heartbeatSession,
  getActiveSession,
} from "@/actions/session";
import { Button } from "@/components/ui/Button";
import { HourReachedOverlay } from "./HourReachedOverlay";

export function Header() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [showHourReached, setShowHourReached] = useState(false);
  const hourShownRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Restore any active session on mount
  useEffect(() => {
    (async () => {
      const session = await getActiveSession();
      if (session) {
        setSessionId(session.id);
        setSeconds(session.totalMinutes * 60);
        setRunning(true);
      }
    })();
  }, []);

  // Show overlay when 1 hour is reached
  useEffect(() => {
    if (seconds >= 3600 && !hourShownRef.current) {
      hourShownRef.current = true;
      setShowHourReached(true);
    }
  }, [seconds]);

  // Tick every second while running
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Heartbeat to DB every 60s while running
  useEffect(() => {
    if (running && sessionId) {
      heartbeatRef.current = setInterval(() => {
        heartbeatSession(sessionId);
      }, 60000);
    } else if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [running, sessionId]);

  const handleStart = useCallback(async () => {
    const session = await startSession();
    setSessionId(session.id);
    setSeconds(0);
    setRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setRunning(false);
    if (sessionId) heartbeatSession(sessionId);
  }, [sessionId]);

  const handleResume = useCallback(() => {
    setRunning(true);
  }, []);

  const handleStop = useCallback(async () => {
    setRunning(false);
    if (sessionId) {
      await endSession(sessionId);
      setSessionId(null);
      setSeconds(0);
    }
  }, [sessionId]);

  const handleReset = useCallback(async () => {
    setRunning(false);
    if (sessionId) {
      await endSession(sessionId);
      setSessionId(null);
    }
    setSeconds(0);
    hourShownRef.current = false;
  }, [sessionId]);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
    {showHourReached && (
      <HourReachedOverlay onDismiss={() => setShowHourReached(false)} />
    )}
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          {running && (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
          <span className="font-mono text-zinc-200 tabular-nums">
            {pad(hrs)}:{pad(mins)}:{pad(secs)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!sessionId ? (
            <Button size="sm" onClick={handleStart}>
              Start
            </Button>
          ) : running ? (
            <Button size="sm" variant="secondary" onClick={handlePause}>
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={handleResume}>
              Resume
            </Button>
          )}
          {(sessionId || seconds > 0) && (
            <Button size="sm" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </header>
    </>
  );
}
