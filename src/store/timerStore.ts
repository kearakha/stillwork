import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimerStore, SoundscapeId, FocusMode, FocusSession } from "./types";

const FOCUS_DURATIONS = {
  "focus": 25,
  "short-break": 5,
  "long-break": 15,
};

const DEFAULT_SOUND_LAYERS = [
  { id: "rain" as SoundscapeId, volume: 70, enabled: false },
  { id: "brown-noise" as SoundscapeId, volume: 50, enabled: false },
  { id: "lofi" as SoundscapeId, volume: 60, enabled: false },
  { id: "forest" as SoundscapeId, volume: 50, enabled: false },
  { id: "ocean" as SoundscapeId, volume: 40, enabled: false },
  { id: "cafe" as SoundscapeId, volume: 30, enabled: false },
  { id: "silence" as SoundscapeId, volume: 0, enabled: true },
];

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      duration: 25,
      timeLeft: 25 * 60,
      status: "idle",
      focusMode: "focus",
      soundLayers: DEFAULT_SOUND_LAYERS,
      intervalId: null,
      currentStreak: 0,
      todayStats: { date: getToday(), focusMinutes: 0, sessionsCompleted: 0 },
      sessions: [],

      setDuration: (minutes: number) => {
        set({
          duration: minutes,
          timeLeft: minutes * 60,
          status: "idle",
        });
      },

      setFocusMode: (mode: FocusMode) => {
        const duration = FOCUS_DURATIONS[mode];
        set({
          focusMode: mode,
          duration,
          timeLeft: duration * 60,
          status: "idle",
        });
      },

      setSoundLayerVolume: (id: SoundscapeId, volume: number) => {
        set((state) => ({
          soundLayers: state.soundLayers.map((layer) =>
            layer.id === id ? { ...layer, volume } : layer
          ),
        }));
      },

      toggleSoundLayer: (id: SoundscapeId) => {
        set((state) => ({
          soundLayers: state.soundLayers.map((layer) =>
            layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
          ),
        }));
      },

      start: () => {
        const { intervalId } = get();
        if (intervalId) clearInterval(intervalId);

        const id = setInterval(() => {
          get().tick();
        }, 1000);

        set({
          status: "running",
          intervalId: id,
        });
      },

      pause: () => {
        const { intervalId } = get();
        if (intervalId) {
          clearInterval(intervalId);
          set({ intervalId: null, status: "paused" });
        }
      },

      reset: () => {
        const { intervalId } = get();
        if (intervalId) clearInterval(intervalId);

        set((state) => ({
          timeLeft: state.duration * 60,
          status: "idle",
          intervalId: null,
        }));
      },

      tick: () => {
        set((state) => {
          if (state.timeLeft <= 1) {
            state.complete();
            return { timeLeft: 0 };
          }
          return { timeLeft: state.timeLeft - 1 };
        });
      },

      complete: () => {
        const { intervalId, focusMode, duration, sessions, todayStats, currentStreak } = get();
        if (intervalId) clearInterval(intervalId);

        const today = getToday();
        const isFocusSession = focusMode === "focus";

        const newSession: FocusSession = {
          id: generateId(),
          mode: focusMode,
          duration: duration,
          completedAt: new Date(),
        };

        const updatedTodayStats = today === todayStats.date
          ? {
              ...todayStats,
              focusMinutes: todayStats.focusMinutes + (isFocusSession ? duration : 0),
              sessionsCompleted: todayStats.sessionsCompleted + (isFocusSession ? 1 : 0),
            }
          : { date: today, focusMinutes: isFocusSession ? duration : 0, sessionsCompleted: isFocusSession ? 1 : 0 };

        const newStreak = isFocusSession ? currentStreak + 1 : currentStreak;

        set({
          status: "completed",
          intervalId: null,
          sessions: [...sessions.slice(-99), newSession],
          todayStats: updatedTodayStats,
          currentStreak: newStreak,
        });

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Stillwork", {
            body: isFocusSession ? "Focus session complete! Take a break." : "Break complete! Ready to focus?",
            icon: "/favicon.ico",
          });
        }
      },

      skipBreak: () => {
        const { intervalId, focusMode } = get();
        if (intervalId) clearInterval(intervalId);

        const nextMode: FocusMode = focusMode === "focus" ? "short-break" : "focus";
        const duration = FOCUS_DURATIONS[nextMode];

        set({
          focusMode: nextMode,
          duration,
          timeLeft: duration * 60,
          status: "idle",
          intervalId: null,
        });
      },
    }),
    {
      name: "stillwork-timer",
      partialize: (state) => ({
        soundLayers: state.soundLayers,
        currentStreak: state.currentStreak,
        todayStats: state.todayStats,
        sessions: state.sessions,
      }),
    }
  )
);
