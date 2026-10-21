"use client";

/**
 * CircularCarousel
 *
 * Idea after the 21st.dev component `circular-carousel` by nexus-ui (MIT):
 * cards on a turning ring, drag with inertia, the front card grows. The
 * original source was not supplied (TECH-SPEC blocker B5), so this is an
 * own implementation, adapted from text cards to photographs as the spec
 * asks (DESIGN-SYSTEM.md 8.7). Replace with the original once its prompt
 * lands in docs/21st/.
 */

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LiquidGlassButton } from "@/components/ui/apple-tahoe-liquid-glass-button";

export type CarouselPhoto = { id: string; src: string; avif?: string; alt: string };

const DEG_PER_PX = 0.18;
const SPRING = { type: "spring", stiffness: 140, damping: 22, mass: 0.9 } as const;

export function CircularCarousel({ items, label }: { items: CarouselPhoto[]; label: string }) {
  const n = items.length;
  // a tight arc rather than a full circle: more portraits in view at once
  const step = Math.min(360 / n, 26);
  const period = step * n;
  const rot = useMotionValue(0);
  const reduce = useReducedMotion();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = React.useState(300);
  const [active, setActive] = React.useState(0);

  // card width follows the stage; the ring radius follows the card width
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setCardW(Math.round(Math.min(360, Math.max(200, w * (w < 768 ? 0.58 : 0.22)))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const radius = Math.round((cardW * 0.56) / Math.tan(((step / 2) * Math.PI) / 180));

  useMotionValueEvent(rot, "change", (r) => {
    const i = (((Math.round(-r / step) % n) + n) % n) as number;
    if (i !== active) setActive(i);
  });

  const settle = (target: number) =>
    animate(rot, target, reduce ? { duration: 0 } : SPRING);
  const go = (dir: 1 | -1) => settle(Math.round(rot.get() / step) * step - dir * step);

  // drag with inertia, then snap to the nearest card
  const drag = React.useRef<{ x: number; r: number; t: number; v: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    rot.stop();
    drag.current = { x: e.clientX, r: rot.get(), t: performance.now(), v: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const next = d.r + (e.clientX - d.x) * DEG_PER_PX;
    d.v = (next - rot.get()) / Math.max(1, now - d.t);
    d.t = now;
    rot.set(next);
  };
  const onUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const thrown = rot.get() + d.v * 240;
    settle(Math.round(thrown / step) * step);
  };

  return (
    <div className="cc" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={stageRef}
        className="cc-stage"
        tabIndex={0}
        aria-label={`${label}: drag or use the arrow keys`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          else if (e.key === "ArrowLeft") go(-1);
          else return;
          e.preventDefault();
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ "--cc-w": `${cardW}px` } as React.CSSProperties}
      >
        <div className="cc-ring" style={{ transform: `translateZ(${-radius}px)` }}>
          {items.map((item, i) => (
            <Card key={item.id} item={item} index={i} step={step} period={period} radius={radius} rot={rot} active={i === active} />
          ))}
        </div>
      </div>

      <div className="cc-controls">
        <LiquidGlassButton
          size={null}
          interactive
          appearance="dark"
          material="regular"
          className="glass-round text-ink"
          aria-label="Previous photo"
          onClick={() => go(-1)}
        >
          <ArrowLeft aria-hidden />
        </LiquidGlassButton>
        <p className="sr-only" aria-live="polite">
          Photo {active + 1} of {n}
        </p>
        <LiquidGlassButton
          size={null}
          interactive
          appearance="dark"
          material="regular"
          className="glass-round text-ink"
          aria-label="Next photo"
          onClick={() => go(1)}
        >
          <ArrowRight aria-hidden />
        </LiquidGlassButton>
      </div>
    </div>
  );
}

function Card({
  item,
  index,
  step,
  period,
  radius,
  rot,
  active,
}: {
  item: CarouselPhoto;
  index: number;
  step: number;
  period: number;
  radius: number;
  rot: MotionValue<number>;
  active: boolean;
}) {
  const base = index * step;
  // angle from the front, folded over one lap of the arc so the row never runs out;
  // the wrap happens at the far ends, where the card is already faded out
  const angle = useTransform(rot, (r) => ((((base + r) % period) + period * 1.5) % period) - period / 2);
  const transform = useTransform(angle, (a) => `rotateY(${a}deg) translateZ(${radius}px) scale(${1 + 0.12 * Math.max(0, Math.cos((a * Math.PI) / 180)) ** 6})`);
  const opacity = useTransform(angle, (a) => Math.max(0, Math.min(1, (1 - Math.abs(a) / (period / 2)) * 2.2)));

  return (
    <motion.figure
      className="cc-card"
      data-asset-id={item.id}
      data-active={active || undefined}
      aria-hidden={!active}
      style={{ transform, opacity }}
    >
      <picture>
        {item.avif ? <source srcSet={item.avif} type="image/avif" /> : null}
        <img src={item.src} alt={item.alt} draggable={false} loading="lazy" decoding="async" />
      </picture>
    </motion.figure>
  );
}
