// Zero-dependency Devotional Audio Synthesizer using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a realistic resonant Brass Temple Bell (Ghanta) sound with harmonics & long shimmer decay
 */
export function playTempleBell() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Fundamental frequencies of an Indian temple bell
    const harmonics = [587.33, 880, 1174.66, 1760, 2349.32]; // D5, A5, D6, A6, D7
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04];
    const decays = [3.5, 2.8, 2.0, 1.4, 0.8];

    harmonics.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      // Slight detune for natural metallic shimmer
      osc.frequency.setValueAtTime(freq + (idx * 1.5), now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(gains[idx], now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decays[idx]);
    });
  } catch {
    // Audio context may be blocked by browser policy until interaction
  }
}

/**
 * Plays a sacred Conch / Shankh resonant tone
 */
export function playShankhDhwani() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.Q.setValueAtTime(4, now);

    // Conch frequency curve: rising then majestic sustained pitch
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.6); // E4
    osc.frequency.exponentialRampToValueAtTime(320, now + 2.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
    gain.gain.linearRampToValueAtTime(0.2, now + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.5);
  } catch {
    // Ignore audio error
  }
}
