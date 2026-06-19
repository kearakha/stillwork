"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/store/timerStore";

interface TimerControlsProps {
  className?: string;
}

export function TimerControls({ className }: TimerControlsProps) {
  const { status, focusMode, start, pause, reset, skipBreak } = useTimerStore();
  const isBreak = focusMode !== "focus";
  const isRunning = status === "running";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {isRunning ? (
        <motion.button
          onClick={pause}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.02 }}
          className="p-5 rounded-full bg-primary text-primary-foreground"
        >
          <Pause className="w-5 h-5" />
        </motion.button>
      ) : (
        <motion.button
          onClick={start}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          className="p-5 rounded-full bg-primary text-primary-foreground"
        >
          <Play className="w-5 h-5 ml-0.5" />
        </motion.button>
      )}

      <motion.button
        onClick={reset}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.04 }}
        className="p-4 rounded-full bg-muted text-muted-foreground"
      >
        <RotateCcw className="w-4 h-4" />
      </motion.button>

      {isBreak && (
        <motion.button
          onClick={skipBreak}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="p-4 rounded-full bg-muted text-muted-foreground"
        >
          <SkipForward className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
}
