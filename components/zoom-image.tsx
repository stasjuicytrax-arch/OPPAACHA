"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { LiquidGlassButton } from "@/components/glass";

type LenisLike = { stop(): void; start(): void };
const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

export type Still = {
  id: string;
  /** srcset strings from stillSet() */
  avif: string;
  webp: string;
  src: string;
  /** the full image for the lightbox */
  full: string;
  alt: string;
  ratio: number;
};

/**
 * A preview that opens the whole image in a glass lightbox (charts, posters:
 * client brief 22.10.2026, never cropped there). The preview itself is
 * passed in as children, so each block keeps its own framing.
 */
export function ZoomImage({
  still,
  className,
  children,
  label,
}: {
  still: Still;
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <>
      <button type="button" className={className} data-asset-id={still.id} onClick={() => setOpen(true)} aria-label={label}>
        {children}
      </button>
      <ImageLightbox still={open ? still : null} onClose={close} />
    </>
  );
}

function ImageLightbox({ still, onClose }: { still: Still | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!still) return;
    lenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [still, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {still ? (
        <motion.div
          key="zoom"
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={still.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // leaving is quicker than arriving; reduced motion keeps a short fade
          exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.2, 0.9, 0.3, 1] } }}
          transition={{ duration: reduce ? 0.2 : 0.35, ease: [0.2, 0.9, 0.3, 1] }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="lightbox-body zoom-body"
            style={{ "--ar": still.ratio } as React.CSSProperties}
            initial={reduce ? false : { scale: 0.94, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduce ? undefined : { scale: 0.96, y: 12, transition: { duration: 0.2, ease: [0.2, 0.9, 0.3, 1] } }}
            transition={{ duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
          >
            <img src={still.full} alt={still.alt} className="zoom-img" decoding="async" />
            <div className="lightbox-bar">
              <span />
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
