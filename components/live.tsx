import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { LiveTrack } from "@/components/live-track";
import { videos } from "@/lib/content";

/** Block 4 (TECH-SPEC 5.4): V04 to V08, OPPAACHA's own sets on stage. */
export function Live() {
  const clips = videos
    // clips still on drive (src null) wait for the media pipeline
    .flatMap((v) => (v.section === "live" && v.src && v.poster ? [{ ...v, src: v.src, poster: v.poster }] : []));

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
