"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { GlassStage, fmt, type PlayableClip } from "@/components/glass-stage";
import { LoopVideo } from "@/components/loop-video";

/**
 * Showreel (TECH-SPEC 5.3): one glass stage, the other clips beside it as
 * stepped cards that swap onto the stage.
 */
export function ShowreelPlayer({ clips }: { clips: PlayableClip[] }) {
  const [index, setIndex] = React.useState(0);
  const clip = clips[index];
  const others = clips.filter((_, i) => i !== index);
  const layoutRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const select = (id: string) => {
    const next = clips.findIndex((c) => c.id === id);
    if (next < 0) return;
    setIndex(next);
    layoutRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  return (
    <div ref={layoutRef} className="reel-layout">
      <GlassStage clip={clip} className="reel-stage" />

      <div className="reel-side">
        <p className="reel-now">
          <span className="label text-muted">Now playing</span>
          <span className="reel-now-title">{clip.title}</span>
        </p>
        {others.map((c) => (
          <button key={c.id} type="button" className="reel-card" data-asset-id={c.id} onClick={() => select(c.id)}>
            <LoopVideo preview={c.preview} poster={c.poster} className="reel-card-media" />
            <span className="reel-card-caption">
              <span className="label text-ink">{c.title}</span>
              <span className="label text-muted">{fmt(c.duration)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
