"use client";

import * as React from "react";
import { ArrowUpRight, Play, X } from "lucide-react";
import { siSpotify } from "simple-icons";
import { InView } from "@/components/in-view";
import { SwipeHints } from "@/components/swipe-hints";
import type { Release } from "@/lib/content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const cover = (id: string, w: number, ext: string) => `${BASE}/media/release/${id}-${w}.${ext}`;

/**
 * Selected Releases (client brief 22.10.2026, block 2): five square covers,
 * title, artists, label, Listen on Spotify. The cover opens the same link.
 * Play loads Spotify's compact player in the card, one at a time: no
 * iframe until asked for.
 */
export function Releases({ releases }: { releases: Release[] }) {
  const [playing, setPlaying] = React.useState<string | null>(null);

  return (
    <section id="releases" aria-labelledby="releases-title" className="rel">
      <div className="shell">
        <div className="rel-head">
          <InView as="h2" className="rel-title display">
            <span id="releases-title" className="m-line" style={{ "--i": 0 } as React.CSSProperties}>
              <span className="m-line-inner">Selected</span>
            </span>
            <span className="m-line" style={{ "--i": 1 } as React.CSSProperties}>
              <span className="m-line-inner text-muted">releases</span>
            </span>
          </InView>
        </div>

        <InView as="ul" stagger className="rel-row">
          {releases.map((r, i) => {
            const name = `${r.artists} - ${r.title}`;
            const open = playing === r.id;
            return (
              <li key={r.id} className="rel-card" data-release={r.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="rel-cover" data-asset-id={r.id} aria-label={`${name} on Spotify (opens in a new tab)`}>
                  <picture>
                    <source type="image/avif" srcSet={`${cover(r.id, 320, "avif")} 320w, ${cover(r.id, 640, "avif")} 640w`} sizes="(max-width: 767px) 70vw, 20vw" />
                    <img
                      src={cover(r.id, 640, "webp")}
                      srcSet={`${cover(r.id, 320, "webp")} 320w, ${cover(r.id, 640, "webp")} 640w`}
                      sizes="(max-width: 767px) 70vw, 20vw"
                      alt={`${r.title} cover`}
                      width={640}
                      height={640}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </a>
                <div className="rel-meta">
                  <span className="label text-muted">{String(i + 1).padStart(2, "0")} / {r.label}</span>
                  <span className="rel-name">{r.title}</span>
                  <span className="rel-artists">{r.artists}</span>
                </div>
                {open ? (
                  <div className="rel-player">
                    <iframe
                      src={`${r.embed}?utm_source=generator&theme=0`}
                      title={`${name}, Spotify player`}
                      height={152}
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                  </div>
                ) : null}
                <div className="rel-actions">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="rel-listen">
                    <svg viewBox="0 0 24 24" aria-hidden className="rel-brand">
                      <path d={siSpotify.path} fill="currentColor" />
                    </svg>
                    Listen on Spotify
                    <ArrowUpRight aria-hidden className="rel-arrow" />
                  </a>
                  <button
                    type="button"
                    className="rel-play"
                    aria-pressed={open}
                    aria-label={open ? `Close the player for ${name}` : `Play ${name} here`}
                    onClick={() => setPlaying(open ? null : r.id)}
                  >
                    {open ? <X aria-hidden /> : <Play aria-hidden />}
                  </button>
                </div>
              </li>
            );
          })}
        </InView>
      </div>
      <SwipeHints scroller=".rel-row" id="releases" label="Releases, swipe horizontally" count={releases.length} />
    </section>
  );
}
