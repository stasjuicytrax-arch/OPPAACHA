"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { LiquidGlass, LiquidGlassButton } from "@/components/ui/apple-tahoe-liquid-glass-button";

/** Signal red as transmitted light (DESIGN-SYSTEM.md 7.4: primary glass is red-toned). */
export const GLASS_RED = "#d8042c";

type GlassLinkProps = {
  href: string;
  tone?: "primary" | "clear";
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;

/**
 * Anchor rendered as Liquid Glass. Primary is red-toned glass, clear is
 * untinted. Text stays --ink at 600 (DESIGN-SYSTEM.md 7.4).
 */
export function GlassLink({ href, tone = "clear", className, children, ...rest }: GlassLinkProps) {
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

/** Pulls its child toward the pointer inside an 80px radius (motion 8). */
export function Magnetic({ children, radius = 80, strength = 0.32 }: { children: React.ReactNode; radius?: number; strength?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const reach = radius + Math.max(r.width, r.height) / 2;
      if (Math.hypot(dx, dy) < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [radius, strength, reduce, x, y]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-flex">
      {children}
    </motion.div>
  );
}

export { LiquidGlass, LiquidGlassButton };
