/** Deterministic 0–1 noise, so the server and the client pick the same letters. */
function noise(n: number) {
  const s = Math.sin(n * 91.17 + 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Renders `text` with a few letters that switch on with a short on/off
 * flicker when the page loads (see .pf-flick in portafolio.css). The rest of
 * the text is static. Roughly one letter in `every` flickers, or exactly the
 * letters at the indexes in `pick` when it is given.
 */
export default function Flicker({
  text,
  seed = 0,
  every = 4,
  delay = 0.1,
  pick,
}: {
  text: string;
  seed?: number;
  every?: number;
  delay?: number;
  pick?: number[];
}) {
  return (
    <>
      {Array.from(text).map((ch, i) => {
        const n = noise(seed * 101 + i);
        const on = pick ? pick.includes(i) : n < 1 / every;
        if (ch === " " || !on) return ch;
        const d = delay + noise(seed * 101 + i + 0.5) * 0.7;
        return (
          <span key={i} className="pf-flick" style={{ ["--pf-on" as string]: `${d.toFixed(2)}s` }}>
            {ch}
          </span>
        );
      })}
    </>
  );
}
