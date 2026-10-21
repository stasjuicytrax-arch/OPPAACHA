"use client";

import * as React from "react";
import { ClipLightbox } from "@/components/clip-lightbox";
import { fmt, type PlayableClip } from "@/components/glass-stage";
import { LiquidGlass } from "@/components/glass";
import { LoopVideo } from "@/components/loop-video";

type LenisLike = {
  on(e: "scroll", f: () => void): void;
  off(e: "scroll", f: () => void): void;
};
const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

/**
 * Live (TECH-SPEC 5.4): a pinned horizontal run of portrait cards, tilted
 * by scroll speed (DESIGN-SYSTEM.md 8.6). Hover plays the 6 s preview; a
 * click opens the clip full screen on a glass stage. Below 768px, or with
 * reduced motion, the row is a plain swipeable strip with no pinning.
 */
export function LiveTrack({ clips, children }: { clips: PlayableClip[]; children: React.ReactNode }) {
  const pinRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState<PlayableClip | null>(null);
  const [hover, setHover] = React.useState<string | null>(null);
  const closeLightbox = React.useCallback(() => setOpen(null), []);

  React.useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    let revert = () => {};
    let cancelled = false;

    // GSAP loads only when this block mounts (DESIGN-SYSTEM.md 11: heavy parts lazy)
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const update = () => ScrollTrigger.update();
      lenis()?.on("scroll", update);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".live-card", track);
        const skew = cards.map((c) => gsap.quickTo(c, "skewX", { duration: 0.5, ease: "power3.out" }));
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const s = gsap.utils.clamp(-6, 6, self.getVelocity() / -320);
              skew.forEach((q) => q(s));
            },
            onScrubComplete: () => skew.forEach((q) => q(0)),
          },
        });
      });

      revert = () => {
        mm.revert();
        lenis()?.off("scroll", update);
      };
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <>
      <div ref={pinRef} className="live-pin">
        <div ref={trackRef} className="live-track">
          {children}
          {clips.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className="live-card"
              data-asset-id={c.id}
              style={{ "--i": i } as React.CSSProperties}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(c.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(c.id)}
              onBlur={() => setHover(null)}
              onClick={() => setOpen(c)}
              aria-label={`${c.venue}: play ${c.title}`}
            >
              <span className="live-card-frame">
                <LoopVideo preview={c.preview} poster={c.poster} active={hover === c.id} className="live-card-media" />
                <LiquidGlass
                  appearance="dark"
                  material="regular"
                  refraction={8}
                  fallbackBlur={14}
                  className="glass-chip live-chip label"
                >
                  {c.venue}
                </LiquidGlass>
              </span>
              <span className="live-card-caption">
                <span className="live-card-title">{c.title}</span>
                <span className="label text-muted">{fmt(c.duration)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <ClipLightbox clip={open} onClose={closeLightbox} />
    </>
  );
}
