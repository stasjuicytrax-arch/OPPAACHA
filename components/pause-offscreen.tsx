"use client";

import * as React from "react";

/**
 * Marks the element matched by `selector` with data-paused while it is off
 * screen, so CSS can stop its infinite animations
 * (animation-play-state: paused). Renders nothing.
 */
export function PauseOffscreen({ selector }: { selector: string }) {
  React.useEffect(() => {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) delete el.dataset.paused;
      else el.dataset.paused = "";
    });
    io.observe(el);
    return () => io.disconnect();
  }, [selector]);
  return null;
}
