/**
 * Small fixed corner readout — coordinates, signal, heartbeat. Purely
 * decorative HUD dressing; it doesn't represent anything real and must
 * never sit on top of interactive content (build number already lives
 * in the footer, so it isn't repeated here).
 */
export default function CornerHUD() {
  return (
    <div className="rg-corner-hud hidden sm:block" aria-hidden="true">
      <div>
        X <span className="rg-hud-accent">047.22</span> Y <span className="rg-hud-accent">019.83</span> Z{" "}
        <span className="rg-hud-accent">004.11</span>
      </div>
      <div>
        SIGNAL <span className="rg-hud-accent">87%</span>
      </div>
      <div>
        <span className="rg-heartbeat">●</span> HEARTBEAT
      </div>
    </div>
  );
}
