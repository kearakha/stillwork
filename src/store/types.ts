export type SoundscapeId = "rain" | "brown-noise" | "lofi" | "forest" | "ocean" | "cafe" | "silence";

export type FocusMode = "focus" | "short-break" | "long-break";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface SoundLayer {
  id: SoundscapeId;
  volume: number;
  enabled: boolean;
}

export interface FocusSession {
  id: string;
  mode: FocusMode;
  duration: number;
  completedAt: Date;
}

export interface DailyStats {
  date: string;
  focusMinutes: number;
  sessionsCompleted: number;
}

interface TimerState {
  duration: number;
  timeLeft: number;
  status: TimerStatus;
  focusMode: FocusMode;
  soundLayers: SoundLayer[];
  intervalId: ReturnType<typeof setInterval> | null;
  currentStreak: number;
  todayStats: DailyStats;
  sessions: FocusSession[];
}

interface TimerActions {
  setDuration: (minutes: number) => void;
  setFocusMode: (mode: FocusMode) => void;
  setSoundLayerVolume: (id: SoundscapeId, volume: number) => void;
  toggleSoundLayer: (id: SoundscapeId) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  complete: () => void;
  skipBreak: () => void;
}

export type TimerStore = TimerState & TimerActions;
