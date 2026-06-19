"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Volume2, Music, TreePine, Waves, Coffee, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimerStore } from "@/store/timerStore";
import type { SoundscapeId } from "@/store/types";

const SOUND_ICONS: Record<SoundscapeId, typeof Droplets> = {
  rain: Droplets,
  "brown-noise": Volume2,
  lofi: Music,
  forest: TreePine,
  ocean: Waves,
  cafe: Coffee,
  silence: CircleDot,
};

const SOUND_LABELS: Record<SoundscapeId, string> = {
  rain: "Rain",
  "brown-noise": "Brown",
  lofi: "Lo-fi",
  forest: "Forest",
  ocean: "Ocean",
  cafe: "Cafe",
  silence: "Silent",
};

export function SoundMixer() {
  const { soundLayers, toggleSoundLayer, setSoundLayerVolume } = useTimerStore();
  const [activeSound, setActiveSound] = useState<SoundscapeId | null>("silence");

  const handleSelect = (id: SoundscapeId) => {
    if (activeSound === id) {
      setActiveSound(null);
      toggleSoundLayer(id);
    } else {
      soundLayers.forEach((l) => {
        if (l.enabled && l.id !== "silence") {
          toggleSoundLayer(l.id);
        }
      });
      if (id !== "silence") {
        toggleSoundLayer(id);
      } else {
        soundLayers.find((l) => l.id === "silence")?.enabled || toggleSoundLayer("silence");
      }
      setActiveSound(id);
    }
  };

  const activeLayer = soundLayers.find((l) => l.id === activeSound);
  const isSilenceActive = activeSound === "silence";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
          Sound
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {soundLayers.map((layer) => {
          const Icon = SOUND_ICONS[layer.id];
          const isActive = activeSound === layer.id;

          return (
            <motion.button
              key={layer.id}
              onClick={() => handleSelect(layer.id)}
              whileTap={{ scale: 0.95 }}
              layout
              animate={{
                scale: isActive ? 1.08 : 1,
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border",
                isActive
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{SOUND_LABELS[layer.id]}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {!isSilenceActive && activeLayer && (
          <motion.div
            key="volume-control"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-muted rounded-2xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary">
                    {(() => {
                      const Icon = SOUND_ICONS[activeSound!];
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {SOUND_LABELS[activeSound!]}
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary font-serif">
                  {activeLayer.volume}%
                </span>
              </div>

              <div className="relative">
                <div className="absolute inset-0 h-1 rounded-full bg-border" />
                <div
                  className="absolute h-1 rounded-full bg-primary"
                  style={{ width: `${activeLayer.volume}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeLayer.volume}
                  onChange={(e) => setSoundLayerVolume(activeSound!, Number(e.target.value))}
                  className="relative w-full h-2 appearance-none cursor-pointer rounded-full z-10"
                  style={{ background: "transparent" }}
                />
              </div>

              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">soft</span>
                <span className="text-[10px] text-muted-foreground">loud</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSilenceActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-2"
        >
          <span className="text-xs text-muted-foreground">
            No ambient sound — pure silence
          </span>
        </motion.div>
      )}
    </div>
  );
}
