"use client";

import * as React from "react";
import { LiquidGlass } from "@/components/glass";
import type { Video } from "@/lib/content";

/**
 * V01 in the hero: poster first, then the 6 s silent preview loop once the
 * page has settled and the clip is on screen (TECH-SPEC 5.1). The full
 * showreel lives in #video.
 */
export function HeroClip({ video }: { video: Video }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [live, setLive] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !video.preview) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let ready = document.readyState === "complete";
    const sync = () => {
      if (!ready) return;
      if (visible) {
        if (!el.src) el.src = video.preview!;
        el.play().then(() => setLive(true), () => {});
      } else if (!el.paused) el.pause();
    };
    const onLoad = () => {
      ready = true;
      sync();
    };
    if (!ready) window.addEventListener("load", onLoad, { once: true });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, [video.preview]);

  return (
    <a href="#video" className="hero-clip group block" data-asset-id={video.id} aria-label={`${video.title}: watch the showreel`}>
      <LiquidGlass appearance="dark" material="clear" refraction={22} fallbackBlur={16} className="hero-clip-frame">
        <div className="hero-clip-media">
          <picture>
            <source srcSet={`${video.poster}.avif`} type="image/avif" />
            <img src={`${video.poster}.webp`} alt="" width={1280} height={720} decoding="async" />
          </picture>
          <video
            ref={ref}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
            data-live={live || undefined}
          />
        </div>
      </LiquidGlass>
      <span className="hero-clip-caption">
        <span className="label text-ink">{video.title}</span>
        <span className="label text-muted">{formatDuration(video.duration)}</span>
      </span>
    </a>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
