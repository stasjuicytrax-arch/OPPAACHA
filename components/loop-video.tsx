"use client";

import * as React from "react";
import { isLite } from "@/components/glass";

/**
 * Silent preview loop: the poster paints first, the video only loads once
 * the page has settled. By default it plays while on screen; pass `active`
 * to drive it from outside instead (hover previews on Live cards).
 * Reduced motion and lite devices keep the poster: on phones nothing plays
 * until a tap opens the clip (DESIGN-SYSTEM.md 8, 11; performance 22.10.2026).
 */
export function LoopVideo({
  preview,
  poster,
  className,
  active,
  sizes = "(max-width: 767px) 50vw, 360px",
}: {
  preview: string | null;
  /** path without extension; .avif and .webp side by side */
  poster: string | null;
  className?: string;
  active?: boolean;
  /** sizes for the poster srcset */
  sizes?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [live, setLive] = React.useState(false);
  const controlled = active !== undefined;

  // controlled: play while active
  React.useEffect(() => {
    const el = ref.current;
    if (!controlled || !el || !preview) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (active) {
      if (!el.src) el.src = preview;
      el.play().then(() => setLive(true), () => {});
    } else {
      el.pause();
      setLive(false);
    }
  }, [active, controlled, preview]);

  // uncontrolled: play while on screen, after load; never on lite devices
  React.useEffect(() => {
    const el = ref.current;
    if (controlled || !el || !preview) return;
    if (isLite() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let ready = document.readyState === "complete";
    const sync = () => {
      if (!ready) return;
      if (visible) {
        if (!el.src) el.src = preview;
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
  }, [controlled, preview]);

  return (
    <span className={["loop-video", className].filter(Boolean).join(" ")}>
      {poster ? <Poster poster={poster} sizes={sizes} /> : null}
      <video ref={ref} muted loop playsInline preload="none" aria-hidden tabIndex={-1} data-live={live || undefined} />
    </span>
  );
}

/** Poster with a small variant for cards: -480 (900 px posters) or -640 (crops). */
function Poster({ poster, sizes }: { poster: string; sizes: string }) {
  const crop = poster.includes("-crop-");
  const [small, full] = crop ? [640, 1280] : [480, 900];
  const set = (ext: string) => `${poster}-${small}.${ext} ${small}w, ${poster}.${ext} ${full}w`;
  return (
    <picture>
      <source srcSet={set("avif")} sizes={sizes} type="image/avif" />
      <img src={`${poster}.webp`} srcSet={set("webp")} sizes={sizes} alt="" width={1280} height={720} loading="lazy" decoding="async" />
    </picture>
  );
}
