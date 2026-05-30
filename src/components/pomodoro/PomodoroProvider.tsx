"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  startSession,
  endSession,
  recordPomodoro,
  getActiveSession,
} from "@/actions/session";
import { PomodoroOverlay } from "@/components/layout/PomodoroOverlay";

const FOCUS_MIN = 25;
const BREAK_MIN = 5;
const LONG_BREAK_MIN = 15;
const LONG_EVERY = 4;
const STORAGE_KEY = "pomodoro-focus";

type Mode = "focus" | "break";

export interface FocusTopic {
  id: number;
  title: string;
}

interface PomodoroState {
  mode: Mode;
  secondsLeft: number;
  running: boolean;
  pomos: number;
  sessionActive: boolean;
  focusTopic: FocusTopic | null;
  /** Start a session. Pass a topic to focus it; omit to keep the current focus. */
  start: (topic?: FocusTopic | null) => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
  setFocusTopic: (t: FocusTopic | null) => void;
}

const Ctx = createContext<PomodoroState | null>(null);

export function usePomodoro(): PomodoroState {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePomodoro must be used within PomodoroProvider");
  return c;
}

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60);
  const [running, setRunning] = useState(false);
  const [pomos, setPomos] = useState(0);
  const [overlay, setOverlay] = useState<{ title: string; message: string } | null>(
    null
  );
  const [focusTopic, setFocusTopicState] = useState<FocusTopic | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef(mode);
  const pomosRef = useRef(pomos);
  const sessionIdRef = useRef(sessionId);
  const secondsLeftRef = useRef(secondsLeft);
  const focusRef = useRef(focusTopic);
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
  useEffect(() => {
    focusRef.current = focusTopic;
  }, [focusTopic]);

  const setFocusTopic = useCallback((t: FocusTopic | null) => {
    setFocusTopicState(t);
    try {
      if (t) localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable (SSR/private mode) — focus just won't persist.
    }
  }, []);

  // Restore an in-progress session (and its focus topic) on mount.
  useEffect(() => {
    (async () => {
      let stored: FocusTopic | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) stored = JSON.parse(raw) as FocusTopic;
      } catch {
        stored = null;
      }
      const session = await getActiveSession();
      if (session) {
        setSessionId(session.id);
        setPomos(session.pomodoros);
        setMode("focus");
        setSecondsLeft(FOCUS_MIN * 60);
        setRunning(false);
        if (session.topicId && stored && stored.id === session.topicId) {
          setFocusTopicState(stored);
        }
      }
    })();
  }, []);

  // Phase boundary — called from the interval callback (safe to setState here).
  const completePhase = useCallback(() => {
    if (modeRef.current === "focus") {
      const n = pomosRef.current + 1;
      setPomos(n);
      if (sessionIdRef.current) {
        recordPomodoro(sessionIdRef.current, FOCUS_MIN, focusRef.current?.id ?? null);
      }
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

  // Tick while running.
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
      if (next > 0) setSecondsLeft(next);
      else completePhase();
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, completePhase]);

  const start = useCallback(
    async (topic?: FocusTopic | null) => {
      const t = topic === undefined ? focusRef.current : topic;
      setFocusTopic(t);
      const session = await startSession(t?.id ?? null);
      setSessionId(session.id);
      setPomos(0);
      setMode("focus");
      setSecondsLeft(FOCUS_MIN * 60);
      setRunning(true);
    },
    [setFocusTopic]
  );

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => setRunning(true), []);
  const skip = useCallback(() => {
    setRunning(true);
    setSecondsLeft(0);
  }, []);
  const reset = useCallback(async () => {
    setRunning(false);
    if (sessionIdRef.current) {
      await endSession(sessionIdRef.current);
      setSessionId(null);
    }
    setPomos(0);
    setMode("focus");
    setSecondsLeft(FOCUS_MIN * 60);
    setOverlay(null);
  }, []);

  const value: PomodoroState = {
    mode,
    secondsLeft,
    running,
    pomos,
    sessionActive: sessionId !== null,
    focusTopic,
    start,
    pause,
    resume,
    skip,
    reset,
    setFocusTopic,
  };

  return (
    <Ctx.Provider value={value}>
      {overlay && (
        <PomodoroOverlay
          title={overlay.title}
          message={overlay.message}
          cta={mode === "focus" ? "Start break" : "Start focus"}
          onDismiss={() => setOverlay(null)}
        />
      )}
      {children}
    </Ctx.Provider>
  );
}
