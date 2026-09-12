const SCRAMBLE_CHARS = "01!<>-_\\/[]{}—=+*^?#$%&";

function pickTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('script, style, textarea, input, [contenteditable], [aria-hidden="true"], [data-no-scramble]')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);
  return nodes;
}

/**
 * Scrambles every visible text node under `root` to random glyphs for
 * `durationMs`, jittering + color-cycling their parent elements, then
 * restores the exact original text and position/color in one frame.
 *
 * Mutates only `Text.nodeValue` (never adds/removes DOM nodes), and always
 * restores the exact original string — safe to run on React-owned DOM
 * since nothing differs from what React expects once it's done.
 *
 * Returns a cancel function that restores everything immediately.
 */
export function scramblePageText(root: HTMLElement, durationMs = 650): () => void {
  const nodes = pickTextNodes(root);
  const originals = nodes.map((node) => node.nodeValue ?? "");
  const parents = new Set<HTMLElement>();
  nodes.forEach((node) => {
    if (node.parentElement) parents.add(node.parentElement);
  });
  parents.forEach((el) => el.classList.add("rg-scramble-jitter"));

  const start = performance.now();
  let raf = 0;
  let done = false;

  function restore() {
    if (done) return;
    done = true;
    nodes.forEach((node, i) => {
      node.nodeValue = originals[i];
    });
    parents.forEach((el) => el.classList.remove("rg-scramble-jitter"));
  }

  function frame(now: number) {
    const progress = (now - start) / durationMs;
    if (progress >= 1) {
      restore();
      return;
    }
    nodes.forEach((node, i) => {
      const original = originals[i];
      let scrambled = "";
      for (const ch of original) {
        scrambled += ch === " " || ch === "\n" ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      node.nodeValue = scrambled;
    });
    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    restore();
  };
}
