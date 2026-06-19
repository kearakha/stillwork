"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/store/timerStore";

const PRESET_DURATIONS = [25, 45, 60];

export function DurationPicker() {
  const { duration, setDuration, status } = useTimerStore();
  const [customValue, setCustomValue] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState<number | null>(null);

  useEffect(() => {
    if (!PRESET_DURATIONS.includes(duration) && duration > 0) {
      setCustomValue(duration.toString());
      setIsCustomMode(true);
    }
  }, [duration]);

  const handlePresetClick = (mins: number) => {
    setIsCustomMode(false);
    setCustomValue("");
    setDuration(mins);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomValue(val);
  };

  const handleCustomBlur = () => {
    const num = parseInt(customValue, 10);
    if (num > 0 && num <= 180) {
      setDuration(num);
    } else if (customValue !== "") {
      setCustomValue(duration.toString());
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomBlur();
    }
  };

  const adjustDuration = (delta: number) => {
    const current = parseInt(customValue || duration.toString(), 10);
    const newVal = Math.max(1, Math.min(180, current + delta));
    setCustomValue(newVal.toString());
    setDuration(newVal);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
          Duration
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          {PRESET_DURATIONS.map((mins) => {
            const isActive = duration === mins && !isCustomMode;
            const isHovered = hoveredPreset === mins && status !== "running";

            return (
              <motion.button
                key={mins}
                onClick={() => handlePresetClick(mins)}
                onMouseEnter={() => setHoveredPreset(mins)}
                onMouseLeave={() => setHoveredPreset(null)}
                disabled={status === "running"}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  isActive
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted border-border text-muted-foreground hover:text-foreground",
                  status === "running" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {mins}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() => setIsCustomMode(!isCustomMode)}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-2.5 rounded-xl border transition-all",
            isCustomMode
              ? "bg-primary/10 border-primary text-primary"
              : "bg-muted border-border text-muted-foreground"
          )}
        >
          <Clock className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isCustomMode && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-muted rounded-2xl p-5 border border-primary/20">
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={() => adjustDuration(-5)}
                  whileTap={{ scale: 0.9 }}
                  disabled={status === "running"}
                  className="p-2 rounded-xl border bg-background text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>

                <div className="flex items-baseline gap-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customValue}
                    onChange={handleCustomChange}
                    onBlur={handleCustomBlur}
                    onKeyDown={handleCustomKeyDown}
                    placeholder={duration.toString()}
                    disabled={status === "running"}
                    className={cn(
                      "w-20 bg-transparent text-center text-3xl font-serif outline-none",
                      "placeholder:text-muted-foreground",
                      status === "running" ? "opacity-40" : "text-foreground"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">min</span>
                </div>

                <motion.button
                  onClick={() => adjustDuration(5)}
                  whileTap={{ scale: 0.9 }}
                  disabled={status === "running"}
                  className="p-2 rounded-xl border bg-background text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-center gap-6">
                  {[5, 10, 15, 30, 60].map((mins) => (
                    <motion.button
                      key={mins}
                      onClick={() => adjustDuration(mins)}
                      disabled={status === "running"}
                      whileTap={{ scale: 0.9 }}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
                    >
                      +{mins}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
