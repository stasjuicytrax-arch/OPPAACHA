import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { bio } from "@/lib/content";

/**
 * Become Human Records (client brief 22.10.2026, block 5): a small block of
 * its own next to the artist's story, not another gallery. The label logo
 * joins when the client sends it.
 */
export function LabelBlock() {
  const l = bio.label;
  return (
    <section id="label" aria-labelledby="label-title" className="lb">
      <div className="shell lb-inner">
        <p className="label text-muted">Label</p>
        <InView as="h2" className="lb-title display">
          <span id="label-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
            <span className="m-line-inner">
              Become <span className="m-accent">Human</span> Records
            </span>
          </span>
        </InView>
        <p className="lb-text">{l.text}</p>
      </div>
    </section>
  );
}
