import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { SupportGrid } from "@/components/support-grid";
import { bio, video } from "@/lib/content";

// Solomun first (Tomorrowland), then the other names, then Solomun again.
const ORDER = ["V01", "V10", "V11", "V09", "V12"];

/**
 * Block 5 (TECH-SPEC 5.5), a quiet block on --surface: headliners playing
 * OPPAACHA tracks. Small type, a lot of air, one even row of clips.
 */
export function Support() {
  const clips = ORDER.map((id) => {
    const v = video(id);
    if (!v.src || !v.poster) throw new Error(`${id} has no encode yet: run npm run media -- --only=support`);
    return { ...v, src: v.src, poster: v.poster };
  });
  // PromoKit, Music highlights: support and the Momentum chart line
  const support = bio.musicHighlights.find((h) => h.startsWith("Support from"));
  const chart = bio.musicHighlights.find((h) => h.includes("Momentum"));

  return (
    <section id="support" aria-labelledby="support-title" className="sup">
      <div className="shell">
        <div className="sup-head">
          <p className="label m-label">
            <span className="m-dot" aria-hidden />/support
          </p>
          <InView as="h2" className="sup-title display">
            <span id="support-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
              <span className="m-line-inner">Played by</span>
            </span>
            <span className="m-line" style={{ "--i": 1 } as CSSProperties}>
              <span className="m-line-inner text-muted">Solomun, Adriatique, CamelPhat</span>
            </span>
          </InView>
          <div className="sup-notes">
            {support ? <p>{support}</p> : null}
            {chart ? <p>{chart}</p> : null}
          </div>
        </div>

        <SupportGrid clips={clips} />
      </div>
    </section>
  );
}
