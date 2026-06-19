"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/store/timerStore";
import type { FocusMode } from "@/store/types";
import { DurationPicker } from "./DurationPicker";

const MODE_LABELS: Record<FocusMode, string> = {
  "focus": "Focus",
  "short-break": "Short Break",
  "long-break": "Long Break",
};

export function FocusModeSelector() {
  const { focusMode, setFocusMode, status } = useTimerStore();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.div
        className="bg-muted rounded-full px-2 py-1.5 flex items-center gap-0.5"
        animate={{
          boxShadow: "0 4px 20px var(--orb-1)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {(["focus", "short-break", "long-break"] as const).map((mode) => {
          const isActive = focusMode === mode;

          return (
            <motion.button
              key={mode}
              onClick={() => setFocusMode(mode)}
              disabled={status === "running"}
              layout
              className={cn(
                "relative px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all z-10",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
                status === "running" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {MODE_LABELS[mode]}
            </motion.button>
          );
        })}
      </motion.div>

      {focusMode === "focus" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xs"
        >
          <DurationPicker />
        </motion.div>
      )}
    </div>
  );
}
