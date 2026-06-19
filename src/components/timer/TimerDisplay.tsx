"use client";

import { cn } from "@/lib/utils";
import type { TimerStatus } from "@/store/types";

interface TimerDisplayProps {
  timeLeft: number;
  status: TimerStatus;
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function TimerDisplay({ timeLeft, status, className }: TimerDisplayProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <span
        className="text-8xl font-serif font-normal tracking-tight text-foreground"
      >
        {formatTime(timeLeft)}
      </span>
      <span
        className="text-[11px] uppercase tracking-[0.3em] font-light text-muted-foreground"
      >
        {status === "idle" ? "ready" : status === "running" ? "in progress" : status}
      </span>
    </div>
  );
}
