"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ChevronsRight } from "lucide-react";
import { LiquidGlass } from "@/components/glass";

/**
 * Swipe affordance for a horizontal strip (Live, Support, Showreel on
 * phones). Attaches to the scroller found by `scroller` inside the parent:
 * - a glass "Swipe" chip with drifting arrows, shown once the strip is half
 *   on screen and really scrolls; gone for the session after the first
 *   touch or scroll (sessionStorage);
 * - one nudge (40px out and back) on first sight, if untouched;
 * - "01 / 05" counter and a red progress line driven by scrollLeft;
 * - a right-edge fade (CSS: [data-swipe-more]);
 * - visually hidden Previous / Next buttons for keyboards;
 * - on fine pointers a "Drag / Scroll" glass chip follows the cursor.
 * Only transform and opacity animate; reduced motion drops nudge and drift.
 */
export function SwipeHints({ scroller, id, label, count }: { scroller: string; id: string; label: string; count: number }) {
  const anchor = React.useRef<HTMLDivElement>(null);
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  const [scrollable, setScrollable] = React.useState(false);
  const [hint, setHint] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [cursor, setCursor] = React.useState(false);
  const bar = React.useRef<HTMLSpanElement>(null);
  const key = `swipe-seen-${id}`;
  const seen = () => {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  };
  const remember = () => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {}
  };

  // find the strip next to us, label it, track whether it scrolls
  React.useEffect(() => {
    const parent = anchor.current?.parentElement;
    const strip = parent?.querySelector<HTMLElement>(scroller) ?? null;
    if (!strip) return;
    strip.setAttribute("aria-label", label);
    strip.setAttribute("role", "region");
    if (!strip.hasAttribute("tabindex")) strip.tabIndex = 0;
    setEl(strip);
    // scrollable = horizontal scrolling is on and there is more to see
    const check = () => {
      const ox = getComputedStyle(strip).overflowX;
      setScrollable((ox === "auto" || ox === "scroll") && strip.scrollWidth > strip.clientWidth + 4);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(strip);
    return () => ro.disconnect();
  }, [scroller, label]);

  // progress, counter, edge fade, dismissal
  React.useEffect(() => {
    if (!el || !scrollable) {
      if (el) delete el.dataset.swipeMore;
      return;
    }
    let nudging = false;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, p)})`;
      setIndex(Math.min(count - 1, Math.round(p * (count - 1))));
      if (p < 0.98) el.dataset.swipeMore = "";
      else delete el.dataset.swipeMore;
    };
    const dismiss = () => {
      if (nudging) return;
      remember();
      setHint(false);
    };
    const onScroll = () => {
      update();
      dismiss();
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", dismiss, { passive: true });

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(pointer: coarse)").matches;
    let nudged = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || seen()) return;
        if (touch) setHint(true);
        if (!nudged && !reduce && touch) {
          nudged = true;
          nudging = true;
          el.scrollTo({ left: 40, behavior: "smooth" });
          setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 350);
          setTimeout(() => (nudging = false), 800);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", dismiss);
      delete el.dataset.swipeMore;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el, scrollable, count]);

  // desktop: Drag / Scroll chip at the cursor over a scrollable strip
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 500, damping: 40 });
  const sy = useSpring(cy, { stiffness: 500, damping: 40 });
  React.useEffect(() => {
    if (!el || !scrollable || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const box = anchor.current;
    if (!box) return;
    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      cx.set(e.clientX - r.left + 14);
      cy.set(e.clientY - r.top + 14);
    };
    const enter = () => setCursor(true);
    const leave = () => setCursor(false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [el, scrollable, cx, cy]);

  const step = (dir: 1 | -1) => {
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (first?.offsetWidth ?? el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div ref={anchor} className="ss" data-scrollable={scrollable || undefined}>
      {scrollable ? (
        <>
          <div className="ss-hint" data-on={hint || undefined} aria-hidden>
            <LiquidGlass appearance="dark" material="regular" priority={1} className="ss-chip label">
              Swipe
              <ChevronsRight aria-hidden className="ss-arrows" />
            </LiquidGlass>
          </div>
          {cursor ? (
            <motion.div className="ss-cursor" style={{ x: sx, y: sy }} aria-hidden>
              <LiquidGlass appearance="dark" material="regular" priority={2} className="ss-chip label">
                Drag / Scroll
              </LiquidGlass>
            </motion.div>
          ) : null}
          <div className="ss-progress">
            <span className="label ss-count" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <span className="ss-track" aria-hidden>
              <span ref={bar} className="ss-fill" />
            </span>
            <button type="button" className="sr-only" onClick={() => step(-1)}>
              Previous
            </button>
            <button type="button" className="sr-only" onClick={() => step(1)}>
              Next
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
