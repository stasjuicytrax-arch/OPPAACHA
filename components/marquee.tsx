"use client";

import * as React from "react";
import { isLite } from "@/components/glass";

type Group = { label: string; items: string[] };
type LenisLike = { on(e: "scroll", f: (l: { velocity: number }) => void): void; off(e: "scroll", f: (l: { velocity: number }) => void): void };

/**
 * Marquee band (DESIGN-SYSTEM.md 8.5): where the music has been, from the
 * PromoKit. The track runs on a CSS animation (transform only); on desktop
 * its playbackRate follows the scroll velocity, reversing when scrolling up,
 * and settles back to cruise speed. Paused off screen; static under reduced
 * motion. The visible track is decorative, a plain list carries the text.
 */
export function Marquee({ groups }: { groups: Group[] }) {
  const band = React.useRef<HTMLElement>(null);
  const track = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = track.current;
    const section = band.current;
    if (!el || !section) return;
    const anim = el.getAnimations()[0];
    if (!anim) return;

    // pause while off screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? anim.play() : anim.pause()));
    io.observe(section);

    // desktop: speed follows the scroll
    if (isLite() || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();
    let target = 1;
    let rate = 1;
    let raf = 0;
    const tick = () => {
      rate += (target - rate) * 0.12;
      target += (1 - target) * 0.06;
      anim.playbackRate = rate;
      raf = Math.abs(rate - 1) > 0.01 || Math.abs(target - 1) > 0.01 ? requestAnimationFrame(tick) : 0;
      if (!raf) anim.playbackRate = 1;
    };
    const onScroll = ({ velocity }: { velocity: number }) => {
      target = Math.max(-5, Math.min(6, 1 + velocity * 0.12));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    let lenis: LenisLike | undefined;
    const attach = () => {
      lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      lenis?.on("scroll", onScroll);
    };
    // Lenis loads lazily; pick it up once it is there
    const wait = setTimeout(attach, 1500);
    return () => {
      io.disconnect();
      clearTimeout(wait);
      lenis?.off("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const row = (
    <>
      {groups.map((g) => (
        <span key={g.label} className="mq-group">
          <span className="label mq-label">{g.label}</span>
          {g.items.map((it) => (
            <span key={it} className="mq-item">
              {it}
              <span className="mq-sep" />
            </span>
          ))}
        </span>
      ))}
    </>
  );

  return (
    <section ref={band} className="mq" aria-label="Where the music has been">
      <ul className="sr-only">
        {groups.map((g) => (
          <li key={g.label}>
            {g.label}: {g.items.join(", ")}
          </li>
        ))}
      </ul>
      <div className="mq-window" aria-hidden>
        <div ref={track} className="mq-track">
          {row}
          {row}
        </div>
      </div>
    </section>
  );
}
