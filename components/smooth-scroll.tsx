"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { isLite } from "@/components/glass";

/**
 * Lenis smooth scroll for the whole page. Off under reduced motion and on
 * lite devices (touch scrolling is native there anyway), where the library
 * is not even downloaded (performance, 22.10.2026).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (isLite() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: Lenis | undefined;
    let cancelled = false;
    import("lenis").then(({ default: L }) => {
      if (cancelled) return;
      lenis = new L({ autoRaf: true, anchors: { offset: -24 } });
      (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);
  return null;
}
