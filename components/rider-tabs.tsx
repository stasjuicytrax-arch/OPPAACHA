"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LiquidGlass } from "@/components/glass";

type Item = { term?: string; text: string };
type Group = { heading: string; items: Item[] };
export type RiderTab = { id: string; label: string; short?: string; title: string; groups: Group[]; closing?: string };

const SPRING = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

/**
 * Rider tabs (TECH-SPEC 5.8): a glass switch with a sliding drop, and the
 * selected part of the rider as text on a glass panel. Arrow keys move
 * between tabs (WAI-ARIA tabs pattern).
 */
export function RiderTabs({ tabs }: { tabs: RiderTab[] }) {
  const [current, setCurrent] = React.useState(tabs[0].id);
  const reduce = useReducedMotion();
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const tab = tabs.find((t) => t.id === current)!;

  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === current);
    const next =
      e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
    if (!next) return;
    e.preventDefault();
    setCurrent(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <div className="rd-tabs">
      <LiquidGlass appearance="dark" material="regular" refraction={18} fallbackBlur={18} className="rd-switch">
        <div role="tablist" aria-label="Rider sections" className="rd-tablist" onKeyDown={onKey}>
          {tabs.map((t) => {
            const selected = t.id === current;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`rd-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`rd-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                className="rd-tab"
                onClick={() => setCurrent(t.id)}
              >
                {selected ? (
                  <motion.span layoutId="rd-drop" className="rd-drop" transition={reduce ? { duration: 0 } : SPRING}>
                    <LiquidGlass appearance="dark" material="clear" refraction={8} fallbackBlur={8} className="rd-drop-glass" />
                  </motion.span>
                ) : null}
                {t.short ? (
                  <>
                    <span className="rd-tab-label rd-long">{t.label}</span>
                    <span className="rd-tab-label rd-short" aria-hidden>
                      {t.short}
                    </span>
                  </>
                ) : (
                  <span className="rd-tab-label">{t.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </LiquidGlass>

      <LiquidGlass appearance="dark" material="regular" refraction={28} fallbackBlur={22} className="rd-panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.id}
            role="tabpanel"
            id={`rd-panel-${tab.id}`}
            aria-labelledby={`rd-tab-${tab.id}`}
            tabIndex={0}
            className="rd-panel-body"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.9, 0.3, 1] }}
          >
            <h3 className="rd-panel-title">{tab.title}</h3>
            <div className="rd-groups">
              {tab.groups.map((g) => (
                <section key={g.heading} className="rd-group">
                  <h4 className="label rd-group-title">{g.heading}</h4>
                  <ul>
                    {g.items.map((it, i) => (
                      <li key={i}>
                        {it.term ? <strong>{it.term}: </strong> : null}
                        {it.text}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            {tab.closing ? <p className="rd-closing">{tab.closing}</p> : null}
          </motion.div>
        </AnimatePresence>
      </LiquidGlass>
    </div>
  );
}
