const GHOST_SNIPPET = `const system = REDGHOST;
system.load(DID_CORE);

if (system.ready) {
  boot();
}

project.status = "WIP";
module.sync();
core.watchdog.arm();`;

/**
 * A single very faint block of "code" drifting behind the page. Purely
 * atmospheric — it must never be legible enough to compete with real
 * content, so it stays tiny, low-opacity, and tucked to one side.
 */
export default function GhostCode() {
  return (
    <div className="rg-ghost-code" aria-hidden="true">
      <pre>{GHOST_SNIPPET}</pre>
    </div>
  );
}
