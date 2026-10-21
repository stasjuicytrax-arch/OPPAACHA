import type { CSSProperties } from "react";
import { InView } from "@/components/in-view";
import { CircularCarousel } from "@/components/ui/circular-carousel";
import { asset, photoSrc, photos } from "@/lib/content";

/**
 * Block 6 (TECH-SPEC 5.6), a loud block. Studio portraits turn on a ring;
 * the five live shots sit in an even grid; the cut-out figure stands in
 * front of the giant OPPAACHA, cropped by the section's lower edge.
 * Black and white by default, colour on hover (DESIGN-SYSTEM.md 9).
 */
export function Photos() {
  const studio = photos
    .filter((p) => p.kind === "studio")
    .map((p) => ({ id: p.id, alt: p.alt, src: photoSrc(p.id, 1280).webp, avif: photoSrc(p.id, 1280).avif }));
  const live = photos.filter((p) => p.kind === "live");
  const cutout = photos.find((p) => p.kind === "cutout")!;
  const cut = photoSrc(cutout.id, 1280);

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
            const s = photoSrc(p.id, 1280);
            return (
              <li key={p.id} className="ph-tile" data-asset-id={p.id} style={{ "--i": i } as CSSProperties}>
                <picture>
                  <source srcSet={s.avif} type="image/avif" />
                  <img src={s.webp} alt={p.alt} loading="lazy" decoding="async" />
                </picture>
              </li>
            );
          })}
        </ul>

        <figure className="ph-figure">
          <picture>
            <source srcSet={cut.avif} type="image/avif" />
            <img src={cut.webp} alt={cutout.alt} data-asset-id={cutout.id} className="ph-cutout" loading="lazy" decoding="async" />
          </picture>
        </figure>
      </div>

      <img src={asset("/media/brand/oppaacha-wordmark-flat.webp")} alt="" aria-hidden width={2400} height={363} className="ph-underlay" />
    </section>
  );
}
