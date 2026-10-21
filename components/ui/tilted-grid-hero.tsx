/**
 * TiltedGridHero
 *
 * API follows the 21st.dev component `tilted-grid-hero` by ruixen.ui (MIT):
 * `images: { src, alt }[]`, `className`, `children`. The original source was
 * not supplied (TECH-SPEC blocker B5), so this is an own implementation of
 * the same idea: a perspective-tilted grid whose columns stream endlessly in
 * alternating directions. Replace with the original once its prompt lands in
 * docs/21st/.
 *
 * Additions for the press kit: optional `avif` source and `id` per image
 * (rendered as data-asset-id for scripts/verify-coverage.mjs).
 *
 * Pure CSS motion (transform only), so it renders on the server and costs no
 * JavaScript. Reduced motion freezes the columns via the global rule.
 */

import * as React from "react";

export type TiltedGridImage = {
  src: string;
  alt: string;
  avif?: string;
  id?: string;
  /** width / height, keeps tiles from shifting while images load */
  ratio?: number;
};

export interface TiltedGridHeroProps {
  images: TiltedGridImage[];
  className?: string;
  children?: React.ReactNode;
  /** Number of streaming columns. Default 4. */
  columns?: number;
  /** Seconds for one full loop of the slowest column. Default 60. */
  duration?: number;
}

function cx(...v: Array<string | false | undefined>) {
  return v.filter(Boolean).join(" ");
}

export function TiltedGridHero({
  images,
  className,
  children,
  columns = 4,
  duration = 60,
}: TiltedGridHeroProps) {
  // Deal images round-robin into columns, then rotate each column so
  // neighbours never start on the same photo.
  const cols = Array.from({ length: columns }, (_, c) => {
    const list = images.filter((_, i) => i % columns === c);
    const shift = c % Math.max(1, list.length);
    return [...list.slice(shift), ...list.slice(0, shift)];
  });

  return (
    <div className={cx("tgh", className)}>
      <div className="tgh-stage" aria-hidden>
        <div className="tgh-plane" style={{ "--tgh-cols": columns } as React.CSSProperties}>
          {cols.map((list, c) => (
            <div
              key={c}
              className="tgh-col"
              style={
                {
                  "--tgh-dur": `${duration * (0.78 + (c % 3) * 0.14)}s`,
                  "--tgh-dir": c % 2 ? "reverse" : "normal",
                  "--tgh-offset": `${(c % 2) * -18}%`,
                } as React.CSSProperties
              }
            >
              {/* The list twice: the track slides by exactly one copy. */}
              <div className="tgh-track">
                {[0, 1].map((copy) =>
                  list.map((img) => (
                    <figure
                      key={`${copy}-${img.src}`}
                      className="tgh-tile"
                      data-asset-id={copy === 0 ? img.id : undefined}
                      style={{ aspectRatio: img.ratio ? String(img.ratio) : "2 / 3" }}
                    >
                      <picture>
                        {img.avif ? <source srcSet={img.avif} type="image/avif" /> : null}
                        <img
                          src={img.src}
                          alt={copy === 0 ? img.alt : ""}
                          loading={copy === 0 ? "eager" : "lazy"}
                          fetchPriority="low"
                          decoding="async"
                        />
                      </picture>
                    </figure>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
