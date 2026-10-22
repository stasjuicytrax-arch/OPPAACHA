import type { CSSProperties } from "react";
import { Maximize2 } from "lucide-react";
import { InView } from "@/components/in-view";
import { LoopVideo } from "@/components/loop-video";
import { ZoomImage, type Still } from "@/components/zoom-image";
import { asset, bio, stillSet, video } from "@/lib/content";

type Line = {
  text: string;
  tone?: "ink" | "muted";
  align?: "start" | "center" | "end";
  pill?: boolean;
  accent?: string;
};
type Img = { id: string; src: string; width: number; ratio: number; alt: string };

const lines = bio.manifesto.lines as Line[];

const still = (img: Img): Still => ({
  id: img.id,
  ...stillSet(img.src, [480]),
  full: `${asset(img.src)}-${img.width}.webp`,
  alt: img.alt,
  ratio: img.ratio,
});

/**
 * Bio & Highlights (client brief 22.10.2026, block 4). The underground /
 * ’90s phrase as the large intro, the three paragraphs, the two Diynamic
 * charts at the Top 10 paragraph, then Music and Touring Highlights with
 * the Australian tour poster at its line. Texts verbatim from the client.
 */
export function Bio() {
  const clip = video("V03");
  const pill = (
    <span className="m-pill" aria-hidden>
      <LoopVideo preview={clip.crop?.preview ?? clip.preview} poster={clip.crop?.poster ?? clip.poster} className="m-pill-media" />
    </span>
  );
  const charts = bio.charts.items as Img[];

  return (
    <section id="bio" aria-labelledby="bio-title" className="bio">
      <div className="manifesto shell">
        <h2 id="bio-title" className="sr-only">
          Bio
        </h2>
        <InView as="div" className="m-title display">
          <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
          {lines.map((l, i) => (
            <span key={i} className="m-line" data-align={l.align ?? "start"} aria-hidden style={{ "--i": i } as CSSProperties}>
              <span className={`m-line-inner ${l.tone === "muted" ? "text-muted" : "text-ink"}`}>
                {renderAccent(l.text, l.accent)}
                {l.pill ? pill : null}
              </span>
            </span>
          ))}
        </InView>
      </div>

      <div className="shell bio-grid">
        <div className="bio-text">
          {bio.bio.map((p, i) => (
            <p key={i} className="bio-p">
              {p}
            </p>
          ))}
          {/* the proof for "two consecutive years among the label's Top 10 artists" */}
          <div className="bio-charts" data-charts-for="top10">
            {charts.map((c) => {
              const s = still(c);
              return (
                <ZoomImage key={c.id} still={s} className="bio-chart" label={`${c.alt}: open the full ranking`}>
                  <picture>
                    <source type="image/avif" srcSet={s.avif} sizes="(max-width: 767px) 44vw, 200px" />
                    <img src={s.src} srcSet={s.webp} sizes="(max-width: 767px) 44vw, 200px" alt={c.alt} width={480} height={Math.round(480 / c.ratio)} loading="lazy" decoding="async" />
                  </picture>
                  <span className="bio-zoom" aria-hidden>
                    <Maximize2 />
                  </span>
                </ZoomImage>
              );
            })}
            <p className="label text-muted bio-charts-note">Diynamic / Top Label Artists</p>
          </div>
        </div>

        <div className="bio-highlights">
          <h3 className="label text-muted">Music highlights</h3>
          <ul className="bio-list" data-highlights="music">
            {bio.musicHighlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          <h3 className="label text-muted">Touring highlights</h3>
          <ul className="bio-list" data-highlights="touring">
            {bio.touringHighlights.map((h) => {
              const poster = "poster" in h && h.poster ? still(h.poster as Img) : null;
              return (
                <li key={h.text} className={poster ? "bio-li-poster" : undefined}>
                  <span>{h.text}</span>
                  {poster ? (
                    <ZoomImage still={poster} className="bio-poster" label={`${poster.alt}: open the poster`}>
                      <picture>
                        <source type="image/avif" srcSet={poster.avif} sizes="88px" />
                        <img src={poster.src} srcSet={poster.webp} sizes="88px" alt={poster.alt} width={480} height={480} loading="lazy" decoding="async" />
                      </picture>
                    </ZoomImage>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** One word per heading in Parabola (DESIGN-SYSTEM.md 3). */
function renderAccent(text: string, accent?: string) {
  if (!accent || !text.includes(accent)) return text;
  const [before, after] = text.split(accent, 2);
  return (
    <>
      {before}
      <span className="m-accent">{accent}</span>
      {after}
    </>
  );
}
