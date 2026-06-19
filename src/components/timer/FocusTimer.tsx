"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { AmbientPlayer } from "@/components/audio/AmbientPlayer";
import { FocusModeSelector } from "./FocusModeSelector";
import { ProgressRing } from "./ProgressRing";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { SoundMixer } from "./SoundMixer";
import { SessionStats } from "./SessionStats";

export function FocusTimer() {
  const { timeLeft } = useTimerStore();

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <AmbientBackground />
      <AmbientPlayer />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <FocusModeSelector />
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="glass-panel rounded-[2rem] p-14">
            <ProgressRing progress={useTimerStore.getState().duration > 0 ? (useTimerStore.getState().duration * 60 - timeLeft) / (useTimerStore.getState().duration * 60) : 0} size={280} />
            <div className="absolute inset-0 flex items-center justify-center">
              <TimerDisplay timeLeft={timeLeft} status={useTimerStore.getState().status} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <TimerControls />
        </motion.div>

        <motion.div
          className="glass-surface rounded-2xl px-6 py-5 w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <SoundMixer />
        </motion.div>

        <motion.div
          className="glass-surface rounded-2xl px-6 py-5 w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <SessionStats />
        </motion.div>
      </motion.div>
    </div>
  );
}
