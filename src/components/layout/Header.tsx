"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  startSession,
  endSession,
  recordPomodoro,
  getActiveSession,
} from "@/actions/session";
import { Button } from "@/components/ui/Button";
import { PomodoroOverlay } from "./PomodoroOverlay";

const FOCUS_MIN = 25;
const BREAK_MIN = 5;
const LONG_BREAK_MIN = 15;
const LONG_EVERY = 4;

type Mode = "focus" | "break";

export function Header() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const [pomos, setPomos] = useState(0);
  const [overlay, setOverlay] = useState<{ title: string; message: string } | null>(
    null
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs mirror the latest state so the interval callback (which closes over
  // its initial values) can read current values without re-subscribing.
  const modeRef = useRef(mode);
  const pomosRef = useRef(pomos);
  const sessionIdRef = useRef(sessionId);
  const secondsLeftRef = useRef(secondsLeft);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    pomosRef.current = pomos;
  }, [pomos]);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);
  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  // Restore any active session on mount (paused, ready to resume).
  useEffect(() => {
    (async () => {
      const session = await getActiveSession();
      if (session) {
        setSessionId(session.id);
        setPomos(session.pomodoros);
        setMode("focus");
        setSecondsLeft(FOCUS_MIN * 60);
        setRunning(false);
      }
    })();
  }, []);

  // Handle a phase boundary (focus→break or break→focus). Called from the
  // interval callback, so calling setState here is safe (not an effect body).
  const completePhase = useCallback(() => {
    if (modeRef.current === "focus") {
      const n = pomosRef.current + 1;
      setPomos(n);
      if (sessionIdRef.current) recordPomodoro(sessionIdRef.current, FOCUS_MIN);
      const isLong = n % LONG_EVERY === 0;
      setOverlay({
        title: `Pomodoro ${n} complete!`,
        message: isLong
          ? "Four in a row — take a long break (~15 min). Step away from the screen."
          : "Nice work. Take a 5-minute break — stand up, no screens.",
      });
      setMode("break");
      setSecondsLeft((isLong ? LONG_BREAK_MIN : BREAK_MIN) * 60);
    } else {
      setOverlay({
        title: "Break over",
        message: "Back to focus — one pomodoro at a time.",
      });
      setMode("focus");
      setSecondsLeft(FOCUS_MIN * 60);
    }
  }, []);

  // Tick every second while running.
  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      const next = secondsLeftRef.current - 1;
      if (next > 0) {
        setSecondsLeft(next);
      } else {
        completePhase();
      }
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, completePhase]);

  const handleStart = useCallback(async () => {
    const session = await startSession();
    setSessionId(session.id);
    setPomos(0);
    setMode("focus");
    setSecondsLeft(FOCUS_MIN * 60);
    setRunning(true);
  }, []);

  const handlePause = useCallback(() => setRunning(false), []);
  const handleResume = useCallback(() => setRunning(true), []);

  const handleSkip = useCallback(() => {
    setRunning(true);
    setSecondsLeft(0);
  }, []);

  const handleReset = useCallback(async () => {
    setRunning(false);
    if (sessionId) {
      await endSession(sessionId);
      setSessionId(null);
    }
    setPomos(0);
    setMode("focus");
    setSecondsLeft(FOCUS_MIN * 60);
    setOverlay(null);
  }, [sessionId]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const isFocus = mode === "focus";

  return (
    <>
      {overlay && (
        <PomodoroOverlay
          title={overlay.title}
          message={overlay.message}
          cta={isFocus ? "Start break" : "Start focus"}
          onDismiss={() => setOverlay(null)}
        />
      )}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span title="Completed pomodoros this session">
            {pomos > 0 ? "🍅".repeat(Math.min(pomos, 8)) : ""}
          </span>
          {pomos > 0 && <span className="tabular-nums">{pomos} done</span>}
        </div>

        <div className="flex items-center gap-3">
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
            {sessionId && (
              <Button size="sm" variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
            )}
            {sessionId && (
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
