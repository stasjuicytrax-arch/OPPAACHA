"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Marks its element with data-inview once it enters the viewport; CSS owns
 * the reveal (masked line rise, DESIGN-SYSTEM.md 8.3). Content stays
 * visible without JavaScript: the hidden state only applies under
 * [data-reveal]:not([data-inview]) inside .js.
 */
export function InView({
  as: Tag = "div",
  className,
  children,
  amount = 0.3,
  stagger = false,
}: {
  as?: "div" | "section" | "h2" | "dl" | "ul";
  className?: string;
  children: React.ReactNode;
  amount?: number;
  /** children rise one after another (motion pass, 22.10.2026) */
  stagger?: boolean;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return React.createElement(
    Tag,
    { ref, className, "data-reveal": "", "data-reveal-stagger": stagger ? "" : undefined, "data-inview": inView ? "" : undefined },
    children
  );
}

/** Counts up to `value` once on screen; tabular mono digits (DESIGN-SYSTEM.md 8.10). */
export function Counter({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = React.useCallback(
    (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [decimals]
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.2, 0.9, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = format(n);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, format]);

  // Server HTML carries the final number, so it reads right without JS.
  return <span ref={ref}>{format(value)}</span>;
}
