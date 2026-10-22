"use client";

import * as React from "react";
import {
  LiquidGlass as LiquidGlassCore,
  LiquidGlassButton as LiquidGlassButtonCore,
  prewarmLiquidGlass,
  type LiquidGlassButtonProps,
  type LiquidGlassMode,
  type LiquidGlassProps,
} from "@/components/ui/apple-tahoe-liquid-glass-button";

/** Signal red as transmitted light (DESIGN-SYSTEM.md 7.4: primary glass is red-toned). */
export const GLASS_RED = "#d8042c";

// --------------------------------------------------------------------------
// Glass budget (performance, 22.10.2026)
//
// Refraction is an SVG filter inside backdrop-filter and its maps are drawn
// pixel by pixel, so it is the most expensive thing on the page.
//
// - Lite devices (phones, coarse pointers, <= 4 cores or <= 4 GB, reduced
//   motion; flagged as html[data-lite] by the inline script in layout.tsx):
//   no refraction anywhere. Only elements marked `keep` (the menu button and
//   the main Booking) get a plain backdrop blur; everything else is static
//   glass drawn in CSS ([data-liquid-glass="off"]).
// - Other devices: refraction only for glass on screen, at most MAX_LIVE at
//   once, by priority; the rest is static glass until a slot frees up.
// --------------------------------------------------------------------------

const MAX_LIVE = 4;

export const isLite = () => typeof document !== "undefined" && document.documentElement.dataset.lite !== undefined;

type Entry = { priority: number; order: number; visible: boolean; live: boolean; set: (v: boolean) => void };
const entries = new Map<number, Entry>();
let nextId = 0;

function reassign() {
  const winners = new Set(
    [...entries.entries()]
      .filter(([, e]) => e.visible)
      .sort(([, a], [, b]) => b.priority - a.priority || a.order - b.order)
      .slice(0, MAX_LIVE)
      .map(([id]) => id)
  );
  for (const [id, e] of entries) {
    const live = winners.has(id);
    if (live !== e.live) {
      e.live = live;
      e.set(live);
    }
  }
}

// Map building runs in idle time, one element per slice, so a slot granted
// mid-scroll finds its maps in the cache.
const warmQueue: Array<() => void> = [];
let warming = false;
function warm(job: () => void) {
  warmQueue.push(job);
  if (warming) return;
  warming = true;
  const idle = (cb: () => void) =>
    typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(cb, { timeout: 4000 })
      : setTimeout(cb, 200);
  const step = () => {
    const next = warmQueue.shift();
    if (!next) {
      warming = false;
      return;
    }
    try {
      next();
    } catch {}
    idle(step);
  };
  idle(step);
}

let io: IntersectionObserver | null = null;
const observed = new Map<Element, number>();
function observer() {
  io ??= new IntersectionObserver(
    (records) => {
      for (const r of records) {
        const id = observed.get(r.target);
        const e = id === undefined ? undefined : entries.get(id);
        if (e) e.visible = r.isIntersecting;
      }
      reassign();
    },
    { rootMargin: "64px 0px" }
  );
  return io;
}

export type GlassBudget = {
  /** Higher wins a refraction slot first. Default 1. */
  priority?: number;
  /** On lite devices keep a real (blur-only) glass instead of the static one. */
  keep?: boolean;
};

/** Decides the render mode of one glass element. Static until proven otherwise. */
function useGlassMode(
  ref: React.RefObject<HTMLElement | null>,
  { priority = 1, keep = false }: GlassBudget,
  look: { appearance?: "light" | "dark"; tint?: string; bezel?: number }
): LiquidGlassMode {
  const [mode, setMode] = React.useState<LiquidGlassMode>("off");

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // lite: never any maps; keep elements get a CSS blur (data-glass-keep)
    if (isLite()) return;
    const id = nextId++;
    entries.set(id, { priority, order: id, visible: false, live: false, set: (live) => setMode(live ? "auto" : "off") });
    observed.set(el, id);
    observer().observe(el);
    warm(() => el.isConnected && prewarmLiquidGlass(el, look));
    return () => {
      observer().unobserve(el);
      observed.delete(el);
      entries.delete(id);
      reassign();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, priority, keep]);

  return mode;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const r of refs) {
      if (!r) continue;
      if (typeof r === "function") r(value);
      else (r as React.MutableRefObject<T | null>).current = value;
    }
  };
}

/** Liquid Glass surface under the budget. Same props as the 21st.dev component. */
export const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps & GlassBudget>(
  ({ priority, keep, mode: _mode, ...props }, ref) => {
    const own = React.useRef<HTMLDivElement | null>(null);
    const mode = useGlassMode(own, { priority, keep }, { appearance: props.appearance, tint: props.tint, bezel: props.bezel });
    return (
      <LiquidGlassCore
        ref={mergeRefs(ref, own)}
        mode={mode}
        data-glass-keep={keep || undefined}
        {...props}
      />
    );
  }
);
LiquidGlass.displayName = "LiquidGlass";

/** Liquid Glass button under the budget. Same props as the 21st.dev component. */
export const LiquidGlassButton = React.forwardRef<HTMLButtonElement, LiquidGlassButtonProps & GlassBudget>(
  ({ priority, keep, mode: _mode, ...props }, ref) => {
    const own = React.useRef<HTMLButtonElement | null>(null);
    const mode = useGlassMode(own, { priority, keep }, { appearance: props.appearance, tint: props.tint, bezel: props.bezel });
    return (
      <LiquidGlassButtonCore
        ref={mergeRefs(ref, own)}
        mode={mode}
        data-glass-keep={keep || undefined}
        {...props}
      />
    );
  }
);
LiquidGlassButton.displayName = "LiquidGlassButton";

type GlassLinkProps = {
  href: string;
  tone?: "primary" | "clear";
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & GlassBudget &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;

/**
 * Anchor rendered as Liquid Glass. Primary is red-toned glass, clear is
 * untinted. Text stays --ink at 600 (DESIGN-SYSTEM.md 7.4).
 */
export function GlassLink({ href, tone = "clear", className, children, priority, keep, ...rest }: GlassLinkProps) {
  const primary = tone === "primary";
  return (
    <LiquidGlassButton
      asChild
      size={null}
      interactive
      appearance="dark"
      material={primary ? "clear" : "regular"}
      tint={primary ? GLASS_RED : undefined}
      refraction={primary ? 14 : 18}
      fallbackBlur={18}
      saturation={1.6}
      priority={priority ?? (primary ? 7 : 6)}
      keep={keep}
      className={[
        "glass-control text-ink font-semibold tracking-[-0.01em] whitespace-nowrap",
        primary ? "glass-primary" : "",
        className ?? "",
      ].join(" ")}
    >
      <a href={href} {...rest}>
        {children}
      </a>
    </LiquidGlassButton>
  );
}
