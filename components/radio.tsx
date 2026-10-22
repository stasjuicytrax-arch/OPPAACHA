"use client";

import * as React from "react";
import { ArrowUpRight, Maximize2, Play, X } from "lucide-react";
import { siSoundcloud } from "simple-icons";
import { InView } from "@/components/in-view";
import { ZoomImage } from "@/components/zoom-image";
import type { Mix } from "@/lib/content";

const player = (url: string) =>
  `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d8042c&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;

/**
 * Radio mixes (client brief 22.10.2026, block 6): SiriusXM and Insomniac
 * Radio guest mixes. One card format: the poster at 3:4, contained on its
 * own colour so small type and logos are never cut; a tap shows the whole
 * poster. Play loads the SoundCloud player, never on page load.
 */
export function Radio({ mixes }: { mixes: Mix[] }) {
  const [playing, setPlaying] = React.useState<string | null>(null);

  return (
    <section id="radio" aria-labelledby="radio-title" className="ra">
      <div className="shell">
        <InView as="h2" className="ra-title display">
          <span id="radio-title" className="m-line" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="m-line-inner">Radio</span>
          </span>
          <span className="m-line" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="m-line-inner text-muted">guest mixes</span>
          </span>
        </InView>

        <InView as="ul" stagger className="ra-row">
          {mixes.map((m, i) => {
            const open = playing === m.id;
            return (
              <li key={m.id} className="ra-card" data-mix={m.id} data-ratio="3:4" style={{ "--i": i } as React.CSSProperties}>
                <ZoomImage
                  still={{
                    id: m.id,
                    avif: `${m.poster}-480.avif 480w, ${m.poster}-1200.avif 1200w`,
                    webp: `${m.poster}-480.webp 480w, ${m.poster}-1200.webp 1200w`,
                    src: `${m.poster}-480.webp`,
                    full: `${m.poster}-1200.webp`,
                    alt: m.posterAlt,
                    ratio: m.ratio,
                  }}
                  className="ra-poster"
                  label={`${m.posterAlt}: open the whole poster`}
                >
                  <span className="ra-frame" style={{ background: m.bg }}>
                    <picture>
                      <source type="image/avif" srcSet={`${m.poster}-480.avif 480w, ${m.poster}-1200.avif 1200w`} sizes="(max-width: 767px) 92vw, 34vw" />
                      <img
                        src={`${m.poster}-480.webp`}
                        srcSet={`${m.poster}-480.webp 480w, ${m.poster}-1200.webp 1200w`}
                        sizes="(max-width: 767px) 92vw, 34vw"
                        alt={m.posterAlt}
                        width={480}
                        height={Math.round(480 / m.ratio)}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                    <span className="ra-zoom" aria-hidden>
                      <Maximize2 />
                    </span>
                  </span>
                </ZoomImage>
                <div className="ra-meta">
                  <h3 className="ra-name">{m.title}</h3>
                  <p className="text-muted">{m.caption}</p>
                </div>
                {open ? (
                  <div className="ra-player">
                    <iframe src={player(m.url)} title={`${m.listen}, SoundCloud player`} height={166} loading="lazy" allow="autoplay" />
                  </div>
                ) : null}
                <div className="ra-actions">
                  <button
                    type="button"
                    className="ra-play"
                    data-player="soundcloud"
                    aria-pressed={open}
                    onClick={() => setPlaying(open ? null : m.id)}
                  >
                    {open ? <X aria-hidden /> : <Play aria-hidden />}
                    {open ? "Close player" : "Play the mix"}
                  </button>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="ra-link" aria-label={`${m.listen} on SoundCloud (opens in a new tab)`}>
                    <svg viewBox="0 0 24 24" aria-hidden className="rel-brand">
                      <path d={siSoundcloud.path} fill="currentColor" />
                    </svg>
                    SoundCloud
                    <ArrowUpRight aria-hidden className="rel-arrow" />
                  </a>
                </div>
              </li>
            );
          })}
        </InView>
      </div>
    </section>
  );
}
