"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SoundName =
  | "boot-line"
  | "boot-ready"
  | "boot-glitch"
  | "panel-vertical"
  | "panel-horizontal"
  | "ui-click"
  | "ui-hover"
  | "game-select"
  | "game-success"
  | "game-fail";

const STORAGE_KEY = "redghost.audio.enabled";
const AMBIENT_SRC = "/audio/ambient.mp3";
const AMBIENT_VOLUME = 0.22;
const AMBIENT_FADE_S = 1.5;

interface AudioContextValue {
  enabled: boolean;
  unlocked: boolean;
  toggle: () => void;
  unlock: () => void;
  play: (name: SoundName) => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

/**
 * Every UI sound effect is synthesized at runtime (no audio files) so
 * those never depend on a binary asset being present. The one exception
 * is the looping background ambience (see startAmbient below), which is
 * a real recorded track played through the same AudioContext.
 */
function synth(
  ctx: AudioContext,
  {
    freq,
    endFreq,
    duration,
    type = "sine",
    gain = 0.05,
    delay = 0,
  }: {
    freq: number;
    endFreq?: number;
    duration: number;
    type?: OscillatorType;
    gain?: number;
    delay?: number;
  }
) {
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const start = ctx.currentTime + delay;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(endFreq, 1),
      start + duration
    );
  }

  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.008);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function fire(ctx: AudioContext, name: SoundName) {
  switch (name) {
    case "boot-line":
      synth(ctx, { freq: 720, endFreq: 420, duration: 0.045, type: "square", gain: 0.045 });
      break;
    case "boot-ready":
      synth(ctx, { freq: 440, duration: 0.09, type: "triangle", gain: 0.05 });
      synth(ctx, { freq: 660, duration: 0.14, type: "triangle", gain: 0.05, delay: 0.1 });
      synth(ctx, { freq: 880, duration: 0.22, type: "triangle", gain: 0.045, delay: 0.2 });
      break;
    case "boot-glitch":
      synth(ctx, { freq: 180, duration: 0.02, type: "square", gain: 0.04 });
      synth(ctx, { freq: 900, duration: 0.015, type: "square", gain: 0.035, delay: 0.02 });
      synth(ctx, { freq: 300, duration: 0.02, type: "square", gain: 0.04, delay: 0.045 });
      synth(ctx, { freq: 1100, duration: 0.015, type: "sawtooth", gain: 0.03, delay: 0.07 });
      synth(ctx, { freq: 150, endFreq: 60, duration: 0.05, type: "square", gain: 0.04, delay: 0.095 });
      break;
    case "panel-vertical":
      synth(ctx, { freq: 180, endFreq: 340, duration: 0.14, type: "sawtooth", gain: 0.03 });
      break;
    case "panel-horizontal":
      synth(ctx, { freq: 340, endFreq: 620, duration: 0.16, type: "sawtooth", gain: 0.03 });
      break;
    case "ui-click":
      synth(ctx, { freq: 900, endFreq: 500, duration: 0.035, type: "square", gain: 0.04 });
      break;
    case "ui-hover":
      synth(ctx, { freq: 1200, duration: 0.02, type: "sine", gain: 0.015 });
      break;
    case "game-select":
      synth(ctx, { freq: 520, endFreq: 720, duration: 0.05, type: "square", gain: 0.045 });
      break;
    case "game-success":
      synth(ctx, { freq: 660, duration: 0.08, type: "triangle", gain: 0.05 });
      synth(ctx, { freq: 990, duration: 0.16, type: "triangle", gain: 0.045, delay: 0.08 });
      break;
    case "game-fail":
      synth(ctx, { freq: 220, endFreq: 90, duration: 0.35, type: "sawtooth", gain: 0.05 });
      break;
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientStartedRef = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setEnabled(stored === "1");
  }, []);

  // unlock()/startAmbient() are stable callbacks that read the latest
  // `enabled` via this ref instead of closing over the state directly.
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Background ambience: one looping track, started once per session right
  // after the AudioContext unlocks. Volume is driven entirely by the gain
  // node below (tracks `enabled`) rather than stopping/restarting the
  // source, so muting is instant and unmuting never re-fetches/re-decodes.
  const startAmbient = useCallback((ctx: AudioContext) => {
    if (ambientStartedRef.current) return;
    ambientStartedRef.current = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.connect(ctx.destination);
    ambientGainRef.current = gain;

    fetch(AMBIENT_SRC)
      .then((res) => res.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((audioBuffer) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(gain);
        source.start(0);
        gain.gain.linearRampToValueAtTime(
          enabledRef.current ? AMBIENT_VOLUME : 0,
          ctx.currentTime + AMBIENT_FADE_S
        );
      })
      .catch(() => {
        // Ambience is a nice-to-have; UI sound effects still work without it.
      });
  }, []);

  const unlock = useCallback(() => {
    if (ctxRef.current) {
      if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
      setUnlocked(true);
      startAmbient(ctxRef.current);
      return;
    }
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctxRef.current = new AC();
    setUnlocked(true);
    startAmbient(ctxRef.current);
  }, [startAmbient]);

  // Fade the ambient bed in/out whenever the mute toggle changes.
  useEffect(() => {
    const ctx = ctxRef.current;
    const gain = ambientGainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(
      enabled ? AMBIENT_VOLUME : 0,
      ctx.currentTime + 0.4
    );
  }, [enabled]);

  // Sounds only work once the browser sees a user gesture. The boot gate
  // calls unlock() explicitly, but anyone landing anywhere else on the
  // site (a direct link, a reload, browser back/forward) would otherwise
  // never get audio — so the first click/key anywhere unlocks it too.
  // Left attached for the page's lifetime: it's cheap once unlocked, and
  // it also resumes the context if the browser suspends it (e.g. after
  // the tab sits backgrounded for a while).
  useEffect(() => {
    const onFirstInteraction = () => unlock();
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, [unlock]);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") return;
      fire(ctx, name);
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ enabled, unlocked, toggle, unlock, play }),
    [enabled, unlocked, toggle, unlock, play]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
