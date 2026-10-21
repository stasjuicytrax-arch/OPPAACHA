"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scroll for the whole page; off under reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -24 } });
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);
  return null;
}
