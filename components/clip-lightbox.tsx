"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { GlassStage, type PlayableClip } from "@/components/glass-stage";
import { LiquidGlass, LiquidGlassButton } from "@/components/glass";

type LenisLike = { stop(): void; start(): void };
const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

/**
 * A clip full screen on a glass stage over the dimmed page (Live, Support).
 * Portalled to <body>: the sections isolate their stacking contexts and the
 * lightbox has to cover the menu. Escape or a click outside closes it.
 */
export function ClipLightbox({
  clip,
  caption,
  onClose,
}: {
  clip: PlayableClip | null;
  caption?: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!clip) return;
    lenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [clip, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {clip ? (
        <motion.div
          key="lightbox"
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${clip.title}, ${caption ?? clip.venue}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // leaving is quicker than arriving; reduced motion keeps a short fade
          exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.2, 0.9, 0.3, 1] } }}
          transition={{ duration: reduce ? 0.2 : 0.35, ease: [0.2, 0.9, 0.3, 1] }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="lightbox-body"
            style={{ "--ar": clip.aspect ?? 9 / 16 } as React.CSSProperties}
            initial={reduce ? false : { scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduce ? undefined : { scale: 0.96, y: 12, transition: { duration: 0.2, ease: [0.2, 0.9, 0.3, 1] } }}
            transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
          >
            <GlassStage clip={clip} mode="open" className="lightbox-stage" />
            <div className="lightbox-bar">
              <LiquidGlass
                priority={8}
                appearance="dark"
                material="regular"
                refraction={8}
                fallbackBlur={14}
                className="glass-chip label"
              >
                {caption ?? clip.venue}
              </LiquidGlass>
              <LiquidGlassButton
                priority={8}
                size={null}
                interactive
                appearance="dark"
                material="regular"
                className="glass-round text-ink"
                aria-label="Close"
                autoFocus
                onClick={onClose}
              >
                <X aria-hidden />
              </LiquidGlassButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
