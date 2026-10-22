import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { CircularCarousel } from "@/components/ui/circular-carousel";
import { asset, photoSet, photos } from "@/lib/content";

/**
 * Block 6 (TECH-SPEC 5.6), a loud block. Studio portraits turn on a ring;
 * the five live shots sit in an even grid; the cut-out figure stands in
 * front of the giant OPPAACHA, cropped by the section's lower edge.
 * Black and white by default, colour on hover (DESIGN-SYSTEM.md 9).
 */
export function Photos() {
  const studio = photos
    .filter((p) => p.kind === "studio")
    .map((p) => {
      const s = photoSet(p.id);
      return { id: p.id, alt: p.alt, src: s.src, srcSet: s.webp, avifSet: s.avif };
    });
  const live = photos.filter((p) => p.kind === "live");
  const cutout = photos.find((p) => p.kind === "cutout")!;
  const cut = photoSet(cutout.id, [640, 1280]);

  return (
    <section id="photo" aria-labelledby="photo-title" className="ph">
      <div className="shell ph-head">
        <InView as="h2" className="ph-title display">
          <span id="photo-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
            <span className="m-line-inner">In the studio</span>
          </span>
          <span className="m-line" data-align="end" style={{ "--i": 1 } as CSSProperties}>
            <span className="m-line-inner text-muted">and on stage</span>
          </span>
        </InView>
      </div>

      <CircularCarousel items={studio} label="Studio portraits" />

      <div className="shell ph-bottom">
        <ul className="ph-grid">
          {live.map((p, i) => {
            const s = photoSet(p.id);
            // the first tile spans two rows (app/photos.css)
            const sizes = i === 0 ? "(max-width: 767px) 46vw, 24vw" : "(max-width: 767px) 46vw, 17vw";
            return (
              <li key={p.id} className="ph-tile" data-asset-id={p.id} style={{ "--i": i } as CSSProperties}>
                <picture>
                  <source srcSet={s.avif} sizes={sizes} type="image/avif" />
                  <img src={s.src} srcSet={s.webp} sizes={sizes} alt={p.alt} loading="lazy" decoding="async" />
                </picture>
              </li>
            );
          })}
        </ul>

        <figure className="ph-figure">
          <picture>
            <source srcSet={cut.avif} sizes="(max-width: 767px) 92vw, 40vw" type="image/avif" />
            <img src={cut.src} srcSet={cut.webp} sizes="(max-width: 767px) 92vw, 40vw" alt={cutout.alt} data-asset-id={cutout.id} className="ph-cutout" loading="lazy" decoding="async" />
          </picture>
        </figure>
      </div>

      <img src={asset("/media/brand/oppaacha-wordmark-flat.webp")} srcSet={`${asset("/media/brand/oppaacha-wordmark-flat-1200.webp")} 1200w, ${asset("/media/brand/oppaacha-wordmark-flat.webp")} 2400w`} sizes="104vw" loading="lazy" decoding="async" alt="" aria-hidden width={2400} height={363} className="ph-underlay" />
    </section>
  );
}
