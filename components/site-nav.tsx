"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { GlassLink, LiquidGlass, LiquidGlassButton } from "@/components/glass";

type Item = { id: string; label: string };

const SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState(ids[0]);
  React.useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const hit = ids.find((id) => seen.get(id));
        if (hit) setActive(hit);
      },
      // a thin band across the middle of the viewport decides
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids]);
  return active;
}

type LenisLike = { stop(): void; start(): void };
const lenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

export function SiteNav({ items }: { items: Item[] }) {
  const ids = React.useMemo(() => [...items.map((i) => i.id), "photo", "booking"], [items]);
  const active = useActiveSection(ids);
  const [compact, setCompact] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 80;
    if (next !== compact) setCompact(next);
  });

  React.useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="nav-intro pointer-events-none fixed inset-x-0 top-0 z-(--z-nav) flex justify-center px-4 pt-4 md:pt-5">
        {/* Desktop: the floating capsule */}
        <LiquidGlass
          appearance="dark"
          material="clear"
          refraction={26}
          blur={1.5}
          fallbackBlur={18}
          saturation={1.6}
          fluid
          className="nav-capsule pointer-events-auto hidden items-center gap-1 rounded-full pl-2 pr-1.5 md:flex"
          data-compact={compact || undefined}
        >
          <a href="#intro" className="nav-mark" aria-label="OPPAACHA, back to top">
            <img src="/media/brand/oppaacha-mark-red.webp" alt="" width={160} height={240} />
          </a>
          <nav aria-label="Sections">
            <ul className="flex items-center">
              {items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    {isActive ? (
                      <motion.span
                        layoutId="nav-drop"
                        className="absolute inset-y-1 inset-x-0"
                        transition={reduce ? { duration: 0 } : SPRING}
                      >
                        <LiquidGlass
                          appearance="dark"
                          material="clear"
                          refraction={8}
                          fallbackBlur={8}
                          className="nav-drop h-full w-full rounded-full"
                        />
                      </motion.span>
                    ) : null}
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className="nav-link relative"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <GlassLink href="#booking" tone="primary" className="nav-booking ml-1.5">
            Booking
          </GlassLink>
        </LiquidGlass>

        {/* Mobile: mark left, round glass button right */}
        <div className="pointer-events-auto flex w-full items-center justify-between md:hidden">
          <a href="#intro" className="nav-mark nav-mark--solo" aria-label="OPPAACHA, back to top">
            <img src="/media/brand/oppaacha-mark-red.webp" alt="" width={160} height={240} />
          </a>
          <LiquidGlassButton
            size={null}
            interactive
            appearance="dark"
            material="regular"
            fallbackBlur={18}
            className="glass-round text-ink"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden />
          </LiquidGlassButton>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            id="nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-(--z-sheet) p-3 md:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.2, 0.9, 0.3, 1] }}
          >
            <LiquidGlass
              appearance="dark"
              material="regular"
              refraction={40}
              fallbackBlur={24}
              className="nav-sheet flex h-full flex-col rounded-[var(--radius-panel)] px-6 pb-6 pt-5"
            >
              <div className="flex items-center justify-between">
                <span className="label text-muted">Menu</span>
                <LiquidGlassButton
                  size={null}
                  interactive
                  appearance="dark"
                  material="clear"
                  className="glass-round text-ink"
                  aria-label="Close menu"
                  autoFocus
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden />
                </LiquidGlassButton>
              </div>
              <nav aria-label="Sections" className="mt-auto">
                <ul className="flex flex-col">
                  {items.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={reduce ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.2, 0.9, 0.3, 1] }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={active === item.id ? "location" : undefined}
                        className="sheet-link display"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <GlassLink href="#booking" tone="primary" className="mt-8 w-full" onClick={() => setOpen(false)}>
                Booking
                <ArrowUpRight aria-hidden />
              </GlassLink>
            </LiquidGlass>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
