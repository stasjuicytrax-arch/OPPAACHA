"use client";

import * as React from "react";
import { ClipLightbox } from "@/components/clip-lightbox";
import { fmt, type PlayableClip } from "@/components/glass-stage";
import { LoopVideo } from "@/components/loop-video";
import { TODO } from "@/lib/content";

/**
 * Support cards (TECH-SPEC 5.5): one row, every frame the same size
 * (client, 21.10.2026). Hover plays the preview, a click opens the clip.
 */
export function SupportGrid({ clips }: { clips: PlayableClip[] }) {
  const [open, setOpen] = React.useState<PlayableClip | null>(null);
  const [hover, setHover] = React.useState<string | null>(null);
  const close = React.useCallback(() => setOpen(null), []);

  return (
    <>
      <ul className="sup-row">
        {clips.map((c, i) => {
          const track = c.title === TODO ? null : c.title;
          return (
            <li key={c.id} style={{ "--i": i } as React.CSSProperties}>
              <button
                type="button"
                className="sup-card"
                data-asset-id={c.id}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(c.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(c.id)}
                onBlur={() => setHover(null)}
                onClick={() => setOpen(c)}
                aria-label={`Played by ${c.playedBy}${track ? `: ${track}` : ""}${c.place ? `, ${c.place}` : ""}`}
              >
                <span className="sup-frame">
                  <LoopVideo preview={c.preview} poster={c.poster} active={hover === c.id} className="sup-media" />
                  <span className="sup-time label">{fmt(c.duration)}</span>
                </span>
                <span className="sup-meta">
                  <span className="label text-muted">Played by</span>
                  <span className="sup-name">{c.playedBy}</span>
                  {track ? <span className="sup-track">“{track}”</span> : <span className="todo-slot sup-todo">{TODO}: track</span>}
                  {c.place ? <span className="sup-place">{c.place}</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <ClipLightbox
        clip={open}
        caption={open ? [`Played by ${open.playedBy}`, open.place].filter(Boolean).join(", ") : undefined}
        onClose={close}
      />
    </>
  );
}
