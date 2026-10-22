import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { ShowreelPlayer } from "@/components/showreel-player";
import { asset, video } from "@/lib/content";

// Main clip first (V03, OPPAACHA at the decks), then the cards.
const ORDER = ["V03", "V02"];

/**
 * Block 3 (TECH-SPEC 5.3), a loud block: the main clip lights the whole
 * section (its own poster, blurred, as ambient light), the glass player sits
 * on the clip, the other clip waits beside it one step lower.
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

      <div className="shell reel-head">
        <InView as="h2" className="reel-title display">
          <span id="video-title" className="m-line" data-align="start" style={{ "--i": 0 } as CSSProperties}>
            <span className="m-line-inner">
              <span className="text-muted">Watch the </span>
              <span className="m-accent">showreel</span>
            </span>
          </span>
        </InView>
      </div>

      <div className="shell">
        <ShowreelPlayer clips={clips} />
      </div>
    </section>
  );
}
