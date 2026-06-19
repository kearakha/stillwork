"use client";

import { motion } from "framer-motion";
import { Flame, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/store/timerStore";

export function SessionStats() {
  const { todayStats, currentStreak, sessions } = useTimerStore();

  const last7Days = sessions.slice(-7);
  const todayHours = Math.floor(todayStats.focusMinutes / 60);
  const todayMins = todayStats.focusMinutes % 60;

  return (
    <div className="w-full">
      <span className="text-[10px] uppercase tracking-[0.2em] font-medium block mb-4 text-muted-foreground">
        Today
      </span>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Flame, value: currentStreak, label: "streak", color: "text-primary" },
          {
            icon: Clock,
            value: todayHours > 0 ? `${todayHours}h ${todayMins}m` : `${todayMins}m`,
            label: "focused",
            color: "text-muted-foreground",
          },
          { icon: CheckCircle, value: todayStats.sessionsCompleted, label: "sessions", color: "text-muted-foreground" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="bg-muted rounded-2xl p-4 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-xl font-medium text-foreground">
                {stat.value}
              </span>
            </div>
            <span className="text-[10px] capitalize text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {last7Days.length > 0 && (
        <div className="mt-5">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium block mb-3 text-muted-foreground">
            This Week
          </span>
          <div className="flex items-end justify-between gap-2 h-14 px-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const daySessions = sessions.slice(-7 - i, -i || undefined);
              const focusMins = daySessions
                .filter((s) => s.mode === "focus")
                .reduce((acc, s) => acc + s.duration, 0);
              const height = Math.min(100, (focusMins / 120) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-full bg-primary/30"
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[9px] text-muted-foreground">7d</span>
            <span className="text-[9px] text-muted-foreground">today</span>
          </div>
        </div>
      )}
    </div>
  );
}
