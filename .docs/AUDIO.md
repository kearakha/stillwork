# Audio Implementation
Use Web Audio API only — no audio files needed.

Rain noise   : White noise + BiquadFilter (lowpass ~800Hz)
Brown noise  : White noise + rolloff per octave
Lo-fi        : Oscillator layers + slight detune + reverb
Volume       : GainNode, fade in/out on play/pause

AudioContext must be created on user gesture (onClick).
Store AudioContext ref in useRef, not Zustand.