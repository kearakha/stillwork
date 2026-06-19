"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Orb {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  let theme = "dark";
  try {
    const { theme: themeContext } = useTheme();
    theme = themeContext;
  } catch {
    // ThemeProvider not available yet
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const isDark = theme === "dark";

    const orbs: Orb[] = isDark
      ? [
          { x: 0.2, y: 0.3, size: 300, speedX: 0.0001, speedY: 0.00015, hue: 35, saturation: 45, lightness: 65, alpha: 0.12, pulseSpeed: 0.0008, pulsePhase: 0 },
          { x: 0.8, y: 0.2, size: 400, speedX: -0.00012, speedY: 0.0001, hue: 40, saturation: 50, lightness: 70, alpha: 0.10, pulseSpeed: 0.0006, pulsePhase: 1 },
          { x: 0.5, y: 0.7, size: 350, speedX: 0.00008, speedY: -0.00012, hue: 30, saturation: 40, lightness: 68, alpha: 0.08, pulseSpeed: 0.0007, pulsePhase: 2 },
          { x: 0.15, y: 0.8, size: 250, speedX: 0.0001, speedY: 0.00008, hue: 45, saturation: 55, lightness: 60, alpha: 0.10, pulseSpeed: 0.0009, pulsePhase: 3 },
          { x: 0.85, y: 0.75, size: 280, speedX: -0.0001, speedY: -0.0001, hue: 38, saturation: 48, lightness: 72, alpha: 0.09, pulseSpeed: 0.0005, pulsePhase: 4 },
          { x: 0.5, y: 0.15, size: 320, speedX: 0.00005, speedY: 0.00012, hue: 42, saturation: 42, lightness: 75, alpha: 0.07, pulseSpeed: 0.0006, pulsePhase: 5 },
        ]
      : [
          { x: 0.2, y: 0.3, size: 280, speedX: 0.00008, speedY: 0.00012, hue: 35, saturation: 30, lightness: 85, alpha: 0.15, pulseSpeed: 0.0007, pulsePhase: 0 },
          { x: 0.8, y: 0.2, size: 350, speedX: -0.0001, speedY: 0.00008, hue: 30, saturation: 35, lightness: 88, alpha: 0.12, pulseSpeed: 0.0006, pulsePhase: 1 },
          { x: 0.5, y: 0.7, size: 300, speedX: 0.00006, speedY: -0.0001, hue: 38, saturation: 28, lightness: 86, alpha: 0.10, pulseSpeed: 0.0008, pulsePhase: 2 },
          { x: 0.15, y: 0.8, size: 220, speedX: 0.00008, speedY: 0.00006, hue: 32, saturation: 32, lightness: 82, alpha: 0.11, pulseSpeed: 0.0007, pulsePhase: 3 },
          { x: 0.85, y: 0.75, size: 260, speedX: -0.00008, speedY: -0.00008, hue: 40, saturation: 30, lightness: 84, alpha: 0.10, pulseSpeed: 0.0005, pulsePhase: 4 },
          { x: 0.5, y: 0.15, size: 300, speedX: 0.00004, speedY: 0.0001, hue: 28, saturation: 35, lightness: 90, alpha: 0.08, pulseSpeed: 0.0006, pulsePhase: 5 },
        ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = isDark ? "#08080c" : "#faf8f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 1;

      orbs.forEach((orb) => {
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        if (orb.x < -0.2) orb.x = 1.2;
        if (orb.x > 1.2) orb.x = -0.2;
        if (orb.y < -0.2) orb.y = 1.2;
        if (orb.y > 1.2) orb.y = -0.2;

        orb.pulsePhase += orb.pulseSpeed;
        const pulseFactor = 0.85 + Math.sin(orb.pulsePhase) * 0.15;
        const currentSize = orb.size * pulseFactor;
        const currentAlpha = orb.alpha * (0.8 + Math.sin(orb.pulsePhase * 1.3) * 0.2);

        const x = orb.x * canvas.width;
        const y = orb.y * canvas.height;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, currentSize);
        gradient.addColorStop(0, `hsla(${orb.hue}, ${orb.saturation}%, ${orb.lightness}%, ${currentAlpha})`);
        gradient.addColorStop(0.4, `hsla(${orb.hue}, ${orb.saturation}%, ${orb.lightness}%, ${currentAlpha * 0.5})`);
        gradient.addColorStop(0.7, `hsla(${orb.hue}, ${orb.saturation - 10}%, ${orb.lightness}%, ${currentAlpha * 0.2})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(x, y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      const centerGlow = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.3,
        0,
        canvas.width * 0.5,
        canvas.height * 0.3,
        canvas.width * 0.6
      );
      centerGlow.addColorStop(0, isDark ? "rgba(212, 165, 116, 0.06)" : "rgba(196, 149, 106, 0.08)");
      centerGlow.addColorStop(0.5, isDark ? "rgba(212, 165, 116, 0.02)" : "rgba(196, 149, 106, 0.03)");
      centerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [theme, mounted]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
    </>
  );
}
