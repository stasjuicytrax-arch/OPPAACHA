import type { CSSProperties } from "react";
import { GlassStage } from "@/components/glass-stage";
import { InView } from "@/components/in-view";
import { bio, stillSet, video } from "@/lib/content";

/**
 * Upcoming collaboration with CamelPhat (client brief 22.10.2026, block 3):
 * CamelPhat playing "In My Hands" live. Until the clip comes off drive the
 * frame from it stands in; the Played by card links here, so the clip is
 * never shown twice as a big player.
 */
export function Collab() {
  const c = bio.collab;
  const clip = video(c.video);
  const still = stillSet(c.poster, [480, 720]);

  return (
    <section id="collab" aria-labelledby="collab-title" className="co">
      <div className="shell co-grid">
        <div className="co-copy">
          <InView as="h2" className="co-title display">
            <span className="m-line" style={{ "--i": 0 } as CSSProperties}>
              <span className="m-line-inner text-muted">Upcoming</span>
            </span>
            <span id="collab-title" className="m-line" style={{ "--i": 1 } as CSSProperties}>
              <span className="m-line-inner">
                with <span className="m-accent">CamelPhat</span>
              </span>
            </span>
          </InView>
          <p className="co-track">{c.title}</p>
          <p className="co-caption label text-muted">{c.caption}</p>
        </div>

        <figure className="co-media" data-asset-id={clip.id}>
          {clip.src && clip.poster ? (
            <GlassStage clip={{ ...clip, src: clip.src, poster: clip.poster }} mode="manual" className="co-stage" />
          ) : (
            <picture>
              <source type="image/avif" srcSet={still.avif} sizes="(max-width: 767px) 92vw, 40vw" />
              <img src={still.src} srcSet={still.webp} sizes="(max-width: 767px) 92vw, 40vw" alt={c.posterAlt} width={720} height={960} loading="lazy" decoding="async" className="co-still" />
            </picture>
          )}
          <figcaption className="sr-only">{c.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
