import type { CSSProperties } from "react";
import { GlassStage } from "@/components/glass-stage";
import { InView } from "@/components/in-view";
import { SwipeHints } from "@/components/swipe-hints";
import { asset, TODO, video } from "@/lib/content";

const ORDER = ["V03", "V02"];

// server-side copy of the player's m:ss format (glass-stage is a client module)
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Block 3 (TECH-SPEC 5.3): a diptych. Text column on columns 1-4, two
 * players of equal size in the clips' own 9:16 on columns 5-12, the second
 * one step (48px) lower. Nothing autoplays; one clip plays at a time. On
 * phones the two players become a swipe strip under the heading.
 * Background: the blurred poster image and red light, no video layer.
 */
export function Showreel() {
  const clips = ORDER.map((id) => {
    const v = video(id);
    if (!v.src || !v.poster) throw new Error(`${id} has no encode yet: run npm run media`);
    return { ...v, src: v.src, poster: v.poster };
  });

  return (
    <section id="video" aria-labelledby="video-title" className="reel">
      <div className="reel-ambient" aria-hidden style={{ "--ambient": `url(${asset("/media/video/V03-ambient.webp")})` } as CSSProperties} />

      <div className="shell reel-grid">
        <div className="reel-text">
          <p className="label reel-label">/video</p>
          <InView as="h2" className="reel-title display">
            <span id="video-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
              <span className="m-line-inner text-muted">Watch the</span>
            </span>
            <span className="m-line" style={{ "--i": 1 } as CSSProperties}>
              <span className="m-line-inner m-accent">showreel</span>
            </span>
          </InView>
          <p className="reel-lead">Two clips, one at a time. Tap to play; sound on request.</p>
          <ul className="reel-list">
            {clips.map((c) => (
              <li key={c.id}>
                <span>{c.title === TODO ? c.venue === TODO ? "Clip" : c.venue : c.title}</span>
                <span className="label text-muted">{fmt(c.duration)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reel-media">
          <div className="reel-players">
            {clips.map((c) => (
              <GlassStage key={c.id} clip={c} mode="manual" className="reel-player" />
            ))}
          </div>
          <SwipeHints scroller=".reel-players" id="reel" label="Showreel clips, swipe horizontally" count={clips.length} />
        </div>
      </div>
    </section>
  );
}
