# Component Map

FocusTimer (root)
  ├── DurationPicker    → props: selected, onChange
  ├── ProgressRing      → props: progress(0-1), size, color
  ├── TimerDisplay      → props: timeLeft(seconds), status
  ├── TimerControls     → props: onStart, onPause, onReset
  ├── AmbientPlayer     → props: soundscape, isPlaying
  └── SoundscapePicker  → props: selected, onChange

Soundscapes: "rain" | "brown-noise" | "lofi" | "silence"
Durations  : 25 | 45 | 60 | "custom" (minutes)