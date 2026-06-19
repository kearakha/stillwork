# Design System
Aesthetic: Liquid Glass (iOS 26 inspired), dark mode only

Colors:
  --bg-base    : #0a0a0f    (near black)
  --bg-glass   : rgba(255,255,255,0.06)
  --border     : rgba(255,255,255,0.10)
  --text-primary: #f0ede8
  --text-muted : #8b8680
  --accent     : #c4a882    (warm sand)
  --ring-active: #e8d5b7
  --ring-track : rgba(255,255,255,0.08)

Glass panel: backdrop-blur-2xl + bg-white/5 + border-white/10
Ring: SVG strokeDasharray, animated with Framer Motion
Font: Geist Mono (timer digits) + Geist Sans (UI)