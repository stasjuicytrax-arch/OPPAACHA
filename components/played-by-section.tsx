import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { PlayedByGrid, type PlayedByCard } from "@/components/played-by";
import { bio, stillSet, video } from "@/lib/content";

// The brief's lineup of six, in its order (client brief 22.10.2026, page 6).
const LINEUP = ["V10", "V17", "V20", "V18", "V19", "V21"];

export function PlayedBy() {
  const cards: PlayedByCard[] = LINEUP.map((id) =>
    id === bio.collab.video
      ? { clip: video(id), link: { href: "#collab", label: "Upcoming", still: stillSet(bio.collab.poster, [480]) } }
      : { clip: video(id) }
  );
  const support = bio.musicHighlights.find((h) => h.startsWith("Support from"));

  return (
    <section id="played-by" aria-labelledby="played-by-title" className="sup">
      <div className="shell">
        <div className="sup-head">
          <InView as="h2" className="sup-title display">
            <span id="played-by-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
              <span className="m-line-inner">Played by</span>
            </span>
          </InView>
          {support ? (
            <div className="sup-notes">
              <p>{support}</p>
            </div>
          ) : null}
        </div>

        <PlayedByGrid cards={cards} />
      </div>
    </section>
  );
}
