"use client";

import * as React from "react";

/**
 * Silent preview loop: the poster paints first, the video only loads once
 * the page has settled. By default it plays while on screen; pass `active`
 * to drive it from outside instead (hover previews on Live cards).
 * Reduced motion keeps the poster (DESIGN-SYSTEM.md 8, 11).
 */
export function LoopVideo({
  preview,
  poster,
  className,
  active,
}: {
  preview: string | null;
  /** path without extension; .avif and .webp side by side */
  poster: string | null;
  className?: string;
  active?: boolean;
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

  // uncontrolled: play while on screen, after load
  React.useEffect(() => {
    const el = ref.current;
    if (controlled || !el || !preview) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
      {poster ? (
        <picture>
          <source srcSet={`${poster}.avif`} type="image/avif" />
          <img src={`${poster}.webp`} alt="" width={1280} height={720} loading="lazy" decoding="async" />
        </picture>
      ) : null}
      <video ref={ref} muted loop playsInline preload="none" aria-hidden tabIndex={-1} data-live={live || undefined} />
    </span>
  );
}
