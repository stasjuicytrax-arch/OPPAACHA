"use client";

import * as React from "react";
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

export { LiquidGlass, LiquidGlassButton };
