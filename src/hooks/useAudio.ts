"use client";

import { useRef, useCallback, useEffect } from "react";
import type { SoundLayer } from "@/store/types";

export function useAudio(soundLayers: SoundLayer[], isPlaying: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<Map<string, { source: AudioBufferSourceNode | OscillatorNode; gain: GainNode; started: boolean }>>(new Map());

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const stopAllSounds = useCallback(() => {
    sourceNodesRef.current.forEach(({ source, gain }) => {
      try {
        if (source.context.state !== "closed") {
          source.stop();
        }
      } catch {
        // ignore if already stopped
      }
      try {
        gain.disconnect();
      } catch {
        // ignore if already disconnected
      }
    });
    sourceNodesRef.current.clear();
  }, []);

  const createWhiteNoise = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }, []);

  const createBrownNoise = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }, []);

  const createPinkNoise = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }, []);

  const createLoFi = useCallback((ctx: AudioContext): OscillatorNode => {
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.2;
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.type = "sine";
    osc.frequency.value = 110;
    return osc;
  }, []);

  const createForest = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    return createPinkNoise(ctx);
  }, []);

  const createOcean = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    const source = createBrownNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    return source;
  }, []);

  const createCafe = useCallback((ctx: AudioContext): AudioBufferSourceNode => {
    const source = createBrownNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    return source;
  }, []);

  const play = useCallback(() => {
    const ctx = getAudioContext();
    const enabledLayers = soundLayers.filter((l) => l.enabled && l.volume > 0);

    if (enabledLayers.length === 0) {
      stopAllSounds();
      return;
    }

    stopAllSounds();

    enabledLayers.forEach((layer) => {
      const existingNode = sourceNodesRef.current.get(layer.id);
      if (existingNode) {
        return;
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(layer.volume / 100 * 0.4, ctx.currentTime + 0.5);
      gain.connect(ctx.destination);

      let source: AudioBufferSourceNode | OscillatorNode;

      switch (layer.id) {
        case "rain":
          source = createWhiteNoise(ctx);
          const rainFilter = ctx.createBiquadFilter();
          rainFilter.type = "lowpass";
          rainFilter.frequency.value = 800;
          source.connect(rainFilter);
          rainFilter.connect(gain);
          break;
        case "brown-noise":
          source = createBrownNoise(ctx);
          source.connect(gain);
          break;
        case "lofi": {
          source = createLoFi(ctx);
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.2;
          lfoGain.gain.value = 5;
          lfo.connect(lfoGain);
          lfoGain.connect(source.frequency);
          lfo.start();
          source.connect(gain);
          break;
        }
        case "forest":
          source = createForest(ctx);
          source.connect(gain);
          break;
        case "ocean":
          source = createOcean(ctx);
          source.connect(gain);
          break;
        case "cafe":
          source = createCafe(ctx);
          source.connect(gain);
          break;
        case "silence":
        default:
          gain.disconnect();
          return;
      }

      try {
        source.start();
        sourceNodesRef.current.set(layer.id, { source, gain, started: true });
      } catch (e) {
        console.warn("Failed to start source:", e);
        gain.disconnect();
      }
    });
  }, [soundLayers, getAudioContext, stopAllSounds, createWhiteNoise, createBrownNoise, createPinkNoise, createLoFi, createForest, createOcean, createCafe]);

  const pause = useCallback(() => {
    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      sourceNodesRef.current.forEach(({ gain }) => {
        try {
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        } catch {
          // ignore
        }
      });
      setTimeout(() => {
        stopAllSounds();
      }, 300);
    }
  }, [stopAllSounds]);

  const updateVolumes = useCallback((layers: SoundLayer[]) => {
    if (audioContextRef.current && isPlaying) {
      layers.forEach((layer) => {
        const node = sourceNodesRef.current.get(layer.id);
        if (node) {
          try {
            node.gain.gain.linearRampToValueAtTime(
              layer.enabled ? layer.volume / 100 * 0.4 : 0,
              audioContextRef.current!.currentTime + 0.1
            );
          } catch {
            // ignore
          }
        }
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && soundLayers.some((l) => l.enabled)) {
      play();
    } else {
      pause();
    }
  }, [isPlaying, play, pause]);

  useEffect(() => {
    updateVolumes(soundLayers);
  }, [soundLayers, updateVolumes]);

  useEffect(() => {
    return () => {
      stopAllSounds();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAllSounds]);

  return { play, pause, updateVolumes };
}
