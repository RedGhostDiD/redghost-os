"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Black-and-white photo tunnel. Photos sit around a ring at different depths
 * on a looping z axis and are projected with a pinhole camera: they appear as
 * dots at the vanishing point, grow as they come towards you and slide off the
 * edges of the screen. Photos are ordered by year, so travelling the tunnel
 * travels through the years. Scroll / drag / swipe / arrow keys change speed.
 */

/** src: light version for the tunnel; full: original quality, shown when opened. */
export type Photo = { src: string; full?: string; year: number | null };

/** Text shown in the INFO panel — edit freely. */
const MOTTO = "REDGHOST // BUILT FROM SCRAPS. MADE TO REMAIN.";
const COLLECTION = "COLLECTION_01";
const INFO_TEXT = [
  "Un espacio independiente dentro del universo RedGhost: archivo de experimentos, recuerdos, fotografías, proyectos y fragmentos de una identidad.",
  "Cada tramo del túnel es un año. Avanza para viajar en el tiempo.",
  "Scroll, arrastra o desliza para avanzar. Clic en una foto para abrirla.",
];

/** Industrial identifiers: RG-0003, FRAME 003 / 024. */
const rgCode = (i: number) => `RG-${String(i + 1).padStart(4, "0")}`;
const frameCode = (i: number, total: number) =>
  `FRAME ${String(i + 1).padStart(3, "0")} / ${String(total).padStart(3, "0")}`;

/** Years with a hand-drawn label in public/ui. Other years fall back to text. */
const YEAR_IMG = new Set([2020, 2021, 2022, 2023, 2024, 2025]);

const MIN_SLOTS = 42; // photos in one loop of the tunnel (repeats if there are fewer photos)
const GAP = 140; // depth between consecutive photos
const FOCAL = 600;
const NEAR = 60;
const FAR = 4200;
// Phones draw photos up to a shorter distance, so ~16 are on screen instead of ~30.
const FAR_PHONE = 2300;
// Phones and tablets: "lite" rendering (no per-frame brightness filter,
// lighter grain, shorter draw distance) so the tunnel keeps a smooth frame rate.
// The chromatic aberration stays on, but only the nearest photos (the big ones,
// where it shows) get the three colour channels; the far ones are one image.
const PHONE_QUERY = "(max-width: 768px), (pointer: coarse)";
// Images are mounted in blocks of this many slots, so React re-renders
// rarely even when scrolling fast.
const MOUNT_CHUNK = 4;
// Lite: photos this far past the start of the camera's block get the full aberration.
const RICH_DEPTH = (MOUNT_CHUNK + 5) * GAP;
// Lite: photos are drawn smaller (fewer pixels to blend, and they fit a narrow screen).
const PHONE_SIZE = 0.7;
const RING_X = 900; // ring the photos are arranged on
const RING_Y = 560;
const BASE_SPEED = 2.2; // depth units per 60 fps frame
const MAX_SPEED = 90;
// Chromatic aberration only shows while moving faster than the idle drift
// (scroll, drag or a jump), so it fades out on its own when you stop.
const CA_SPEED = 0.15; // px per unit of speed above the idle drift
const CA_MAX = 7;
const PHOTO_CA = 0.5; // photo split relative to the text split
const PHOTO_CA_MAX = 7; // px on screen, so photos stay recognisable
const YEAR_AHEAD = 700; // a year "starts" when its first photo is this far ahead
const FRAME_AHEAD = 320; // the FRAME counter shows the next photo at least this far ahead
const RED_SHARE = 0.28; // share of photos with a thin red frame
const GLITCH_EVERY = [3500, 8000]; // ms between occasional glitches (min, max)

type Slot = {
  photo: number;
  x: number;
  y: number;
  z: number;
  w: number;
  tilt: number;
  red: boolean; // thin red frame
  light: number; // per-photo exposure variation
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Photos come in sorted by year; each one is repeated in place so years stay contiguous. */
function buildSlots(count: number): Slot[] {
  const r = rng(7);
  const reps = Math.max(1, Math.ceil(MIN_SLOTS / count));
  return Array.from({ length: count * reps }, (_, i) => {
    const angle = i * 2.39996 + r() * 0.5; // golden angle: even spread round the ring
    const rad = 0.45 + r() * 0.55; // keep the centre clear
    return {
      photo: Math.floor(i / reps),
      x: Math.cos(angle) * RING_X * rad,
      y: Math.sin(angle) * RING_Y * rad,
      z: i * GAP,
      w: 150 + r() * 110,
      tilt: (r() - 0.5) * 6,
      red: r() < RED_SHARE,
      light: 0.78 + r() * 0.34,
    };
  });
}

/**
 * Noise tiles for the high-ISO look. Luminance noise is per pixel; chroma noise
 * is drawn at half resolution and scaled up, so it forms the soft coloured
 * blotches a sensor gives at max ISO.
 */
const NOISE_TILE = 256;
function noiseTile(kind: "lum" | "chroma"): string {
  const step = kind === "chroma" ? 2 : 1;
  const n = NOISE_TILE / step;
  const small = document.createElement("canvas");
  small.width = small.height = n;
  const ctx = small.getContext("2d")!;
  const img = ctx.createImageData(n, n);
  const g = () => (Math.random() + Math.random() + Math.random()) / 3; // ~gaussian 0..1
  for (let i = 0; i < img.data.length; i += 4) {
    if (kind === "lum") {
      const v = g() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    } else {
      img.data[i] = g() * 255;
      img.data[i + 1] = g() * 255;
      img.data[i + 2] = g() * 255;
    }
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  if (step === 1) return small.toDataURL();
  const big = document.createElement("canvas");
  big.width = big.height = NOISE_TILE;
  const bctx = big.getContext("2d")!;
  bctx.imageSmoothingEnabled = true;
  bctx.drawImage(small, 0, 0, NOISE_TILE, NOISE_TILE);
  return big.toDataURL();
}

/**
 * A grayscale photo split into red, green and blue copies that are screen-
 * blended back together. Aligned they make the original gray image; shifting
 * the red and blue copies (via --cax / --cay) gives colour fringes.
 */
function CAImage({ src, lite = false }: { src: string; lite?: boolean }) {
  // Hidden until loaded: the tinted backgrounds alone would screen-blend to a white box.
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setLoaded(!!imgRef.current?.complete && imgRef.current.naturalWidth > 0);
  }, [src]);
  if (lite) {
    // One plain image: no colour channels, no blend modes. Much cheaper on phones.
    return (
      <span className={`ca ca-lite ${loaded ? "is-loaded" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt="" draggable={false} decoding="async" onLoad={() => setLoaded(true)} />
      </span>
    );
  }
  return (
    <span className={`ca ${loaded ? "is-loaded" : ""}`}>
      {(["g", "r", "b"] as const).map((c) => (
        <span key={c} className={`ca-ch ca-${c}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={c === "g" ? imgRef : undefined}
            src={src}
            alt=""
            draggable={false}
            decoding="async"
            onLoad={c === "g" ? () => setLoaded(true) : undefined}
          />
        </span>
      ))}
    </span>
  );
}

/** Hand-drawn year label, or plain text for years without an image. */
function YearLabel({ year, className = "" }: { year: number; className?: string }) {
  if (!YEAR_IMG.has(year)) return <span className={`year-text ${className}`}>{year}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`year-img ${className}`} src={`/tunel/ui/${year}.png`} alt={String(year)} draggable={false} />;
}

/** Hand-drawn close button (the circled X). */
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="ui-btn close" aria-label="Cerrar" onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tunel/ui/cerrar.gif" alt="" draggable={false} />
    </button>
  );
}

/**
 * The opened photo: shows the light version at once (already loaded by the
 * tunnel) and swaps in the original quality as soon as it has downloaded.
 */
function ViewerImage({ photo }: { photo: Photo }) {
  const [ready, setReady] = useState<string | null>(null);
  useEffect(() => {
    if (!photo.full || photo.full === photo.src) return;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => setReady(photo.full!);
    img.src = photo.full;
    return () => {
      img.onload = null;
    };
  }, [photo.full, photo.src]);
  return <CAImage src={ready === photo.full ? photo.full : photo.src} />;
}

type SlotProps = {
  it: Slot;
  index: number;
  src: string;
  live: boolean;
  lite: boolean;
  small: boolean;
  register: (index: number, el: HTMLButtonElement | null) => void;
  onOpen: (photo: number) => void;
};

const TunnelSlot = memo(function TunnelSlot({ it, index, src, live, lite, small, register, onOpen }: SlotProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={rgCode(it.photo)}
      className={`photo ${it.red ? "is-red" : ""}`}
      ref={(el) => register(index, el)}
      style={{ width: small ? it.w * PHONE_SIZE : it.w, visibility: "hidden" }}
      onClick={() => onOpen(it.photo)}
    >
      {/* Mounted only near the camera (a little beyond the draw distance, so it is loaded before it shows). */}
      {live && <CAImage src={src} lite={lite} />}
      <span className="photo-code" aria-hidden="true">
        {rgCode(it.photo)}
      </span>
    </button>
  );
});

const mod = (n: number, m: number) => ((n % m) + m) % m;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * photos: the collection, ordered by year.
 * grain:  film grain over the opened photo (set in /tunel/admin → CONFIGURACIÓN).
 */
export default function Tunnel({ photos, grain = true }: { photos: Photo[]; grain?: boolean }) {
  const slots = useMemo(() => buildSlots(photos.length), [photos.length]);
  const loop = slots.length * GAP;
  const years = useMemo(
    () => [...new Set(photos.map((p) => p.year).filter((y): y is number => y !== null))].sort((a, b) => a - b),
    [photos],
  );

  const [open, setOpen] = useState<number | null>(null);
  const [panel, setPanel] = useState<"index" | "info" | null>(null);
  const [started, setStarted] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [lite, setLite] = useState(false);
  const far = lite ? FAR_PHONE : FAR;
  // Block of slots the camera is in. Only the photos just ahead of it get their image
  // mounted, so the tunnel never loads the whole collection at once.
  const [camChunk, setCamChunk] = useState(0);

  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const lumRef = useRef<HTMLDivElement>(null);
  const chromaRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    z: 0,
    speed: BASE_SPEED,
    boost: 0,
    mx: 0,
    my: 0,
    cx: 0,
    cy: 0,
    paused: false,
    jump: null as number | null,
  });
  const drag = useRef<{ y: number; moved: number } | null>(null);

  useEffect(() => {
    state.current.paused = open !== null || panel !== null;
  }, [open, panel]);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const update = () => setLite(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // High-ISO noise: build the tiles once, then jump them to a random offset
  // ~24 times a second so the grain boils like video from a sensor at max ISO.
  // The layers are one tile larger than the screen and are moved with a
  // transform, which the GPU does without repainting anything.
  useEffect(() => {
    const lum = lumRef.current;
    const chroma = chromaRef.current;
    if (!lum || !chroma) return;
    const lumTile = noiseTile("lum");
    lum.style.backgroundImage = `url(${lumTile})`;
    // Same tile, static, is the film grain of the opened photo.
    rootRef.current?.style.setProperty("--grain", `url(${lumTile})`);
    if (!lite) chroma.style.backgroundImage = `url(${noiseTile("chroma")})`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rnd = () =>
      `translate3d(${-Math.floor(Math.random() * NOISE_TILE)}px, ${-Math.floor(Math.random() * NOISE_TILE)}px, 0)`;
    const id = setInterval(
      () => {
        lum.style.transform = rnd();
        if (!lite) chroma.style.transform = rnd();
      },
      lite ? 84 : 42,
    );
    return () => clearInterval(id);
  }, [lite]);

  // Animation loop.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    let raf = 0;
    let last = performance.now();
    let lastCa = -1;
    let lastYear: number | null | undefined;
    let lastFrame = -1;
    let lastChunk = -1;
    // Last visibility written per slot, so hidden photos are not touched every frame.
    const shown: boolean[] = [];
    const still: boolean[] = [];

    const tick = (now: number) => {
      const k = Math.min(4, (now - last) / (1000 / 60)); // 1 at 60 fps
      last = now;
      const cruise = s.paused ? 0 : reduce ? 0.4 : BASE_SPEED;
      s.boost *= Math.pow(0.92, k);
      const want = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, cruise + s.boost));
      s.speed += (want - s.speed) * (1 - Math.pow(0.85, k));
      const z0 = s.z;
      if (s.jump !== null) {
        // Fly to a year: ease towards the target, then hand back to the drift.
        s.z += (s.jump - s.z) * (reduce ? 1 : 1 - Math.pow(0.9, k));
        if (Math.abs(s.jump - s.z) < 2) s.jump = null;
      } else {
        s.z += s.speed * k;
      }
      const vel = (s.z - z0) / Math.max(k, 0.001);
      s.cx += (s.mx - s.cx) * (1 - Math.pow(0.93, k));
      s.cy += (s.my - s.cy) * (1 - Math.pow(0.93, k));

      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const diag = Math.hypot(halfW, halfH);
      // The ring is designed for a ~1440×900 screen; shrink it on narrow / short screens.
      const kx = Math.min(1, Math.max(0.42, halfW / 720));
      const ky = Math.min(1, Math.max(0.6, halfH / 450));
      // Aberration in screen px: zero while idle, grows with the actual speed.
      const extra = Math.max(0, Math.abs(vel - cruise) - 0.3);
      const ca = extra > 0 ? Math.min(CA_MAX, extra * CA_SPEED) : 0;
      if (rootRef.current && (Math.abs(ca - lastCa) > 0.05 || (ca === 0 && lastCa !== 0))) {
        lastCa = ca;
        rootRef.current.style.setProperty("--ca", `${ca.toFixed(2)}px`);
        rootRef.current.style.setProperty("--ca-k", (ca / CA_MAX).toFixed(3));
      }

      const chunk = Math.floor(mod(s.z, loop) / (GAP * MOUNT_CHUNK));
      if (chunk !== lastChunk) {
        lastChunk = chunk;
        setCamChunk(chunk);
      }

      let nearestD = Infinity;
      let nearestYear: number | null = null;
      let frameD = Infinity;
      let frame = 0;
      for (let i = 0; i < slots.length; i++) {
        const it = slots[i];
        const d = mod(it.z - s.z, loop);
        if (d > YEAR_AHEAD && d < nearestD) {
          nearestD = d;
          nearestYear = photos[it.photo].year;
        }
        if (d > FRAME_AHEAD && d < frameD) {
          frameD = d;
          frame = it.photo;
        }
        const el = els.current[i];
        if (!el) continue;
        if (d < NEAR || d > far) {
          if (shown[i] !== false) {
            el.style.visibility = "hidden";
            shown[i] = false;
          }
          continue;
        }
        const p = FOCAL / d;
        const sx = halfW + (it.x * kx - s.cx) * p;
        const sy = halfH + (it.y * ky - s.cy) * p;
        const fog = clamp01(1 - d / far) ** 1.4; // emerge out of the dark
        const pass = clamp01((d - NEAR) / 220); // fade as it passes you
        const op = fog * pass;
        if (shown[i] !== true) {
          el.style.visibility = "visible";
          shown[i] = true;
        }
        el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%) scale(${p}) rotate(${it.tilt}deg)`;
        const light = (0.35 + 0.75 * fog) * it.light;
        if (lite) {
          // On black, dimming with opacity looks the same as brightness() and costs nothing.
          el.style.opacity = (op * Math.min(1, light)).toFixed(3);
        } else {
          el.style.opacity = op.toFixed(3);
          el.style.filter = `brightness(${light.toFixed(3)})`;
        }
        // Keep hairlines and labels a steady size on screen whatever the photo's scale.
        el.style.setProperty("--px", (1 / p).toFixed(4));
        el.style.setProperty("--fs", `${(Math.min(14, Math.max(7, 10 * Math.sqrt(p))) / p).toFixed(2)}px`);
        el.style.zIndex = String(Math.round(far - d));
        el.style.pointerEvents = op > 0.3 ? "auto" : "none";
        // Idle (no aberration): the fringe offsets are only reset once, not every frame.
        if (ca === 0) {
          if (!still[i]) {
            el.style.setProperty("--cax", "0px");
            el.style.setProperty("--cay", "0px");
            still[i] = true;
          }
          continue;
        }
        still[i] = false;
        // Lens-like: fringes point away from the centre and grow towards the edges.
        // Divided by the scale so the shift is in screen px whatever the photo's size.
        const rx = (sx - halfW) / diag;
        const ry = (sy - halfH) / diag;
        const amt = Math.min(PHOTO_CA_MAX, ca * PHOTO_CA * (1 + 2 * Math.hypot(rx, ry))) / p;
        const len = Math.hypot(rx, ry) || 1;
        el.style.setProperty("--cax", `${((rx / len) * amt).toFixed(2)}px`);
        el.style.setProperty("--cay", `${((ry / len) * amt * 0.5).toFixed(2)}px`);
      }
      if (nearestYear !== lastYear) {
        lastYear = nearestYear;
        setYear(nearestYear);
      }
      if (frame !== lastFrame && counterRef.current) {
        lastFrame = frame;
        counterRef.current.textContent = `${frameCode(frame, photos.length)} · ${rgCode(frame)}`;
      }
      // Red progress line: how far through the collection you are.
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${(mod(s.z, loop) / loop).toFixed(4)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slots, loop, photos, far, lite]);

  // Occasional glitch: every few seconds one visible photo tears for a moment.
  // Punctual on purpose — never constant.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const [a, b] = GLITCH_EVERY;
      timer = setTimeout(fire, a + Math.random() * (b - a));
    };
    const fire = () => {
      if (!state.current.paused) {
        const pool = els.current.filter(
          (el): el is HTMLButtonElement => !!el && el.style.visibility === "visible" && Number(el.style.opacity) > 0.55,
        );
        const el = pool[Math.floor(Math.random() * pool.length)];
        if (el) {
          el.classList.add("is-glitch");
          setTimeout(() => el.classList.remove("is-glitch"), 420);
        }
      }
      schedule();
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  // Input: wheel, drag/swipe, mouse look, keyboard.
  useEffect(() => {
    const s = state.current;
    const kick = (v: number) => {
      s.jump = null;
      s.boost = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, s.boost + v));
      setStarted(true);
    };
    const wheel = (e: WheelEvent) => {
      if (s.paused) return; // let the INDEX / INFO panels scroll normally
      e.preventDefault();
      kick((e.deltaMode === 1 ? 30 : 1) * e.deltaY * 0.12);
    };
    const down = (e: PointerEvent) => {
      if (!s.paused) drag.current = { y: e.clientY, moved: 0 };
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        s.mx = (e.clientX / window.innerWidth - 0.5) * 360;
        s.my = (e.clientY / window.innerHeight - 0.5) * 220;
      }
      const d = drag.current;
      if (!d) return;
      const dy = d.y - e.clientY;
      d.y = e.clientY;
      d.moved += Math.abs(dy);
      kick(dy * 0.6);
    };
    // Cleared after the click handler runs, so a drag doesn't open a photo.
    const up = () => setTimeout(() => (drag.current = null), 0);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen((o) => {
          if (o === null) setPanel(null);
          return null;
        });
      }
      if (s.paused) return;
      if (e.key === "ArrowUp" || e.key === " ") kick(25);
      else if (e.key === "ArrowDown") kick(-25);
      else return;
      e.preventDefault();
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
    };
  }, []);

  /** Fly forward until the first photo of that year is just ahead. */
  const goToYear = (y: number) => {
    const s = state.current;
    const first = slots.find((it) => photos[it.photo].year === y);
    if (!first) return;
    const target = first.z - YEAR_AHEAD - 200;
    s.jump = target + Math.ceil((s.z + 1 - target) / loop) * loop;
    s.boost = 0;
    setStarted(true);
    setPanel(null);
  };

  const openPhoto = open !== null ? photos[open] : null;
  const onOpen = useCallback((photo: number) => {
    if (!drag.current || drag.current.moved < 6) setOpen(photo);
  }, []);
  const register = useCallback((index: number, el: HTMLButtonElement | null) => {
    els.current[index] = el;
  }, []);
  const mountFrom = camChunk * MOUNT_CHUNK * GAP;

  return (
    <main className={`tunnel ${lite ? "is-lite" : ""}`} ref={rootRef}>
      {slots.map((it, i) => (
        <TunnelSlot
          key={i}
          it={it}
          index={i}
          src={photos[it.photo].src}
          live={mod(it.z - mountFrom, loop) < far + (MOUNT_CHUNK + 3) * GAP}
          lite={lite && mod(it.z - mountFrom, loop) >= RICH_DEPTH}
          small={lite}
          register={register}
          onOpen={onOpen}
        />
      ))}

      <div className="progress" aria-hidden="true">
        <div className="progress-bar" ref={progressRef} />
      </div>

      <div className="vignette" aria-hidden="true" />
      <div className="fringe" aria-hidden="true" />

      <header className={`intro ${started ? "is-gone" : ""}`}>
        <p className="sig">
          REDGHOST <span className="red">/</span> ARCHIVE
        </p>
        <h1>TÚNEL</h1>
        <p className="ids">
          <span>{COLLECTION}</span>
          <span>
            {String(photos.length).padStart(3, "0")} FRAMES
          </span>
          {years.length > 0 && (
            <span>
              ARCHIVE / {years[0]}
              {years.length > 1 ? `—${years[years.length - 1]}` : ""}
            </span>
          )}
        </p>
        <p className="hint">scroll o desliza para entrar</p>
        <p className="motto">{MOTTO}</p>
      </header>

      <nav className="topbar">
        <button type="button" className="ui-btn nav-index" aria-label="Índice" onClick={() => setPanel("index")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tunel/ui/index.png" alt="" draggable={false} />
        </button>
        <button type="button" className="ui-btn nav-info" aria-label="Información" onClick={() => setPanel("info")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/tunel/ui/info.gif" alt="" draggable={false} />
        </button>
      </nav>

      {year !== null && (
        <div className="year-now" aria-live="polite">
          <YearLabel key={year} year={year} className="year-pop" />
        </div>
      )}

      <div className="hud hud-l" aria-hidden="true">
        <span className="dot" /> <span ref={counterRef}>{frameCode(0, photos.length)}</span>
      </div>
      <div className="hud hud-r" aria-hidden="true">
        ↑ ↓ · scroll · clic para abrir
      </div>

      {panel === "index" && (
        <section className="panel" role="dialog" aria-modal="true" aria-label="Índice">
          <CloseButton onClick={() => setPanel(null)} />
          <div className="panel-body">
            <p className="panel-head">
              REDGHOST <span className="red">/</span> ARCHIVE · {COLLECTION} · {String(photos.length).padStart(3, "0")}{" "}
              FRAMES
            </p>
            {[...years, ...(photos.some((p) => p.year === null) ? [null] : [])].map((y) => (
              <div key={y ?? "sin-ano"} className="index-year">
                {y !== null ? (
                  <button type="button" className="ui-btn index-year-btn" onClick={() => goToYear(y)} title="Ir a este año">
                    <YearLabel year={y} />
                  </button>
                ) : (
                  <span className="year-text">sin año</span>
                )}
                <div className="index-grid">
                  {photos.map((p, i) =>
                    p.year === y ? (
                      <button key={i} type="button" className="ui-btn thumb" onClick={() => setOpen(i)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt={rgCode(i)} loading="lazy" draggable={false} />
                        <span className="thumb-code">{rgCode(i)}</span>
                      </button>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {panel === "info" && (
        <section className="panel panel-info" role="dialog" aria-modal="true" aria-label="Información">
          <CloseButton onClick={() => setPanel(null)} />
          <div className="panel-body info-body">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="info-title" src="/tunel/ui/info.gif" alt="Info" draggable={false} />
            <p className="info-motto">{MOTTO}</p>
            {INFO_TEXT.map((t) => (
              <p key={t}>{t}</p>
            ))}
            {years.length > 0 && (
              <div className="info-years">
                {years.map((y) => (
                  <button key={y} type="button" className="ui-btn" onClick={() => goToYear(y)} title="Ir a este año">
                    <YearLabel year={y} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {openPhoto && (
        <div className={`viewer ${grain ? "has-grain" : ""}`} role="dialog" aria-modal="true" aria-label="Foto" onClick={() => setOpen(null)}>
          <ViewerImage key={open} photo={openPhoto} />
          <div className="viewer-id" key={open}>
            <span className="viewer-code">{rgCode(open!)}</span>
            <span>
              {frameCode(open!, photos.length)} · {COLLECTION}
            </span>
            <span>ARCHIVE / {openPhoto.year ?? "—"}</span>
          </div>
          {openPhoto.year !== null && (
            <div className="viewer-year">
              <YearLabel year={openPhoto.year} />
            </div>
          )}
          <CloseButton onClick={() => setOpen(null)} />
        </div>
      )}

      <div className="iso iso-lum" ref={lumRef} aria-hidden="true" />
      <div className="iso iso-chroma" ref={chromaRef} aria-hidden="true" />
    </main>
  );
}
