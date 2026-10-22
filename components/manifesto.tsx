import type { CSSProperties } from "react";
import { Counter, InView } from "@/components/in-view";
import { LoopVideo } from "@/components/loop-video";
import { bio, video } from "@/lib/content";

type Line = {
  text: string;
  tone?: "ink" | "muted";
  align?: "start" | "center" | "end";
  pill?: boolean;
  accent?: string;
};
type Stat = { value: number; suffix?: string; label: string; decimals?: number };

const lines = (bio.manifesto.lines ?? []) as Line[];
// the numbers moved into Music Highlights as one compact line (client brief 22.10.2026)
const stats: Stat[] = [];

/**
 * Block 2 (TECH-SPEC 5.2): two-tone manifesto with a red pill in the line,
 * stepped alignment, then 3-4 numbers in NKDuy Mono with a counter.
 * Copy and numbers come from the PromoKit only; without them the parts are
 * left out (client: no visible placeholders).
 */
export function Manifesto() {
  const clip = video("V03");
  const pill = (
    <span className="m-pill" aria-hidden>
      <LoopVideo preview={clip.crop?.preview ?? clip.preview} poster={clip.crop?.poster ?? clip.poster} className="m-pill-media" />
    </span>
  );

  return (
    <section id="about" aria-labelledby="about-title" className="manifesto shell">
      {lines.length ? (
        <InView as="h2" className="m-title display">
          <span id="about-title" className="sr-only">
            {lines.map((l) => l.text).join(" ")}
          </span>
          {lines.map((l, i) => (
            <span key={i} className="m-line" data-align={l.align ?? "start"} aria-hidden style={{ "--i": i } as CSSProperties}>
              <span className={`m-line-inner ${l.tone === "muted" ? "text-muted" : "text-ink"}`}>
                {renderAccent(l.text, l.accent)}
                {l.pill ? pill : null}
              </span>
            </span>
          ))}
        </InView>
      ) : null}

      <InView as="dl" className="m-stats" amount={0.4}>
        {stats.length
          ? stats.map((s, i) => (
              <div key={s.label} className="m-stat" style={{ "--i": i } as CSSProperties}>
                <dt className="label text-muted">{s.label}</dt>
                <dd className="m-num">
                  <Counter value={s.value} decimals={s.decimals} />
                  {s.suffix ? <span className="text-accent">{s.suffix}</span> : null}
                </dd>
              </div>
            ))
          : null}
      </InView>
    </section>
  );
}

/** One word per heading in Parabola (DESIGN-SYSTEM.md 3). */
function renderAccent(text: string, accent?: string) {
  if (!accent || !text.includes(accent)) return text;
  const [before, after] = text.split(accent, 2);
  return (
    <>
      {before}
      <span className="m-accent">{accent}</span>
      {after}
    </>
  );
}
