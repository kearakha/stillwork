"use client";

import { useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useTimerStore } from "@/store/timerStore";

export function AmbientPlayer() {
  const { soundLayers, status } = useTimerStore();
  const { play, pause } = useAudio(soundLayers, status === "running");

  useEffect(() => {
    if (status === "running") {
      play();
    } else {
      pause();
    }
  }, [status, play, pause]);

  return null;
}
