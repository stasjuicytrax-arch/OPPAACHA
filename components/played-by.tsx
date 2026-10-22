"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { ClipLightbox } from "@/components/clip-lightbox";
import { fmt, type PlayableClip } from "@/components/glass-stage";
import { InView } from "@/components/in-view";
import { LoopVideo } from "@/components/loop-video";
import { SwipeHints } from "@/components/swipe-hints";
import type { Video } from "@/lib/content";

export type PlayedByCard = {
  clip: Video;
  /** CamelPhat: the clip lives in the collaboration block */
  link?: { href: string; label: string; still: { avif: string; webp: string; src: string } };
};

const known = (s?: string) => (s && !s.startsWith("TODO_") ? s : null);

/**
 * Played by (client brief 22.10.2026, block 9): six artists, one caption
 * system, artist → track → event or venue when known. Hover plays the
 * preview, a click opens the clip. CamelPhat links up to the collaboration
 * instead of a second player; a clip still on drive shows the name only.
 */
export function PlayedByGrid({ cards }: { cards: PlayedByCard[] }) {
  const [open, setOpen] = React.useState<PlayableClip | null>(null);
  const [hover, setHover] = React.useState<string | null>(null);
  const close = React.useCallback(() => setOpen(null), []);

  return (
    <>
      <InView as="ul" stagger className="sup-row">
        {cards.map(({ clip: c, link }, i) => {
          const track = known(c.track);
          const meta = (
            <span className="sup-meta">
              <span className="sup-name">{c.playedBy}</span>
              {track ? <span className="sup-track">“{track}”</span> : null}
              {c.place ? <span className="sup-place">{c.place}</span> : null}
            </span>
          );
          const playable = c.src && c.poster ? ({ ...c, src: c.src, poster: c.poster } as PlayableClip) : null;
          return (
            <li key={c.id} data-played-by={c.playedBy} style={{ "--i": i } as React.CSSProperties}>
              {link ? (
                <a href={link.href} className="sup-card">
                  <span className="sup-frame">
                    <picture className="sup-media">
                      <source type="image/avif" srcSet={link.still.avif} sizes="(max-width: 767px) 60vw, 16vw" />
                      <img src={link.still.src} srcSet={link.still.webp} sizes="(max-width: 767px) 60vw, 16vw" alt="" loading="lazy" decoding="async" />
                    </picture>
                    <span className="sup-time label">
                      <ArrowUp aria-hidden className="sup-up" />
                      {link.label}
                    </span>
                  </span>
                  {meta}
                </a>
              ) : playable ? (
                <button
                  type="button"
                  className="sup-card"
                  data-asset-id={c.id}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHover(c.id)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(c.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => setOpen(playable)}
                  aria-label={`Played by ${c.playedBy}${track ? `: ${track}` : ""}${c.place ? `, ${c.place}` : ""}`}
                >
                  <span className="sup-frame">
                    <LoopVideo preview={c.preview} poster={c.poster} active={hover === c.id} className="sup-media" />
                    <span className="sup-time label">{fmt(c.duration)}</span>
                  </span>
                  {meta}
                </button>
              ) : (
                <div className="sup-card sup-card-wait">
                  <span className="sup-frame sup-frame-wait" aria-hidden>
                    <span className="sup-initial">{c.playedBy}</span>
                  </span>
                  {meta}
                </div>
              )}
            </li>
          );
        })}
      </InView>
      <SwipeHints scroller=".sup-row" id="played-by" label="Played by, swipe horizontally" count={cards.length} />
      <ClipLightbox
        clip={open}
        caption={open ? [`Played by ${open.playedBy}`, known(open.track) ? `“${open.track}”` : null, open.place].filter(Boolean).join(" · ") : undefined}
        onClose={close}
      />
    </>
  );
}
