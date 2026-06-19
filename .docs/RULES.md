# Coding Rules
1. All components: functional + TypeScript strict
2. No inline styles — Tailwind only
3. No any type — define interfaces/types
4. State lives in Zustand store, not component state
   (exception: local UI state like hover, open/close)
5. Audio: always check AudioContext state before play
6. Never use useEffect for timer — use setInterval in store
7. All animations via Framer Motion, not CSS keyframes
8. Mobile-first responsive design