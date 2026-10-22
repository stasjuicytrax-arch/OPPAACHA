import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { LiveTrack } from "@/components/live-track";
import { videos } from "@/lib/content";

// Batur and TRIP first (client brief 22.10.2026), venues alternating.
const ORDER = ["V13", "V16", "V05", "V15", "V14", "V04", "V07", "V08"];

/** Live on stage: OPPAACHA's own sets, the brief's compact selection. */
export function Live() {
  const clips = videos
    // a clip still on drive (src null) waits for the media pipeline
    .flatMap((v) => (v.section === "live" && v.src && v.poster ? [{ ...v, src: v.src, poster: v.poster }] : []))
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

  return (
    <section id="live" aria-labelledby="live-title" className="live">
      <LiveTrack clips={clips}>
        <div className="live-intro">
          <InView as="h2" className="live-title display">
            <span id="live-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
              <span className="m-line-inner">Live</span>
            </span>
            <span className="m-line" style={{ "--i": 1 } as CSSProperties}>
              <span className="m-line-inner text-muted">on stage</span>
            </span>
          </InView>
          <p className="live-count label text-muted">{String(clips.length).padStart(2, "0")} clips</p>
        </div>
      </LiveTrack>
    </section>
  );
}
