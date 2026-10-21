import type { CSSProperties } from "react";
import { Counter, InView } from "@/components/in-view";
import { LoopVideo } from "@/components/loop-video";
import { bio, video, TODO } from "@/lib/content";

type Line = {
  text: string;
  tone?: "ink" | "muted";
  align?: "start" | "center" | "end";
  pill?: boolean;
  accent?: string;
};
type Stat = { value: number; suffix?: string; label: string; decimals?: number };

const lines = (bio.manifesto.lines ?? []) as Line[];
const stats = (bio.stats ?? []) as Stat[];

/**
 * Block 2 (TECH-SPEC 5.2): two-tone manifesto with a red pill in the line,
 * stepped alignment, then 3-4 numbers in NKDuy Mono with a counter.
 * Copy and numbers come from the PromoKit only; until then the block keeps
 * its composition with marked slots instead of invented text.
 */
export function Manifesto() {
  const clip = video("V03");
  const pill = (
    <span className="m-pill" aria-hidden>
      <LoopVideo preview={clip.preview} poster={clip.poster} className="m-pill-media" />
    </span>
  );

  return (
    <section id="about" aria-labelledby="about-title" className="manifesto shell">
      <p className="label m-label">
        <span className="m-dot" aria-hidden />/about
      </p>

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
      ) : (
        <InView as="div" className="m-title m-title--todo">
          <h2 id="about-title" className="sr-only">
            Manifesto, waiting for the PromoKit
          </h2>
          <span className="m-line" data-align="start" style={{ "--i": 0 } as CSSProperties}>
            <span className="m-line-inner">
              <span className="m-ph" style={{ "--w": "4.6em" } as CSSProperties} />
              {pill}
            </span>
          </span>
          <span className="m-line" data-align="end" style={{ "--i": 1 } as CSSProperties}>
            <span className="m-line-inner">
              <span className="m-ph" style={{ "--w": "6.4em" } as CSSProperties} />
            </span>
          </span>
          <span className="m-line" data-align="center" style={{ "--i": 2 } as CSSProperties}>
            <span className="m-line-inner">
              <span className="m-ph m-ph--muted" style={{ "--w": "3.8em" } as CSSProperties} />
            </span>
          </span>
          <p className="todo-slot m-todo">{TODO}: manifesto</p>
        </InView>
      )}

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
          : [0, 1, 2, 3].map((i) => (
              <div key={i} className="m-stat m-stat--todo" style={{ "--i": i } as CSSProperties} aria-hidden={i > 0 || undefined}>
                <dt className="label text-muted">
                  {i === 0 ? `${TODO}: numbers` : <span className="m-ph" style={{ "--w": "8em" } as CSSProperties} />}
                </dt>
                <dd className="m-num m-num--todo" aria-hidden>
                  <span className="m-ph m-ph--num" />
                </dd>
              </div>
            ))}
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
