import type { CSSProperties } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { GlassLink } from "@/components/glass";
import { HeroClip } from "@/components/hero-clip";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { asset, bio, isTodo, photoSet, photos, video } from "@/lib/content";

// Every photo except the cut-out, which waits for its own moment in #photo.
// Baked black-and-white variants: the old CSS filter sat on the whole
// animated layer and was recomputed every frame (performance, 22.10.2026).
const ribbon = photos
  .filter((p) => p.kind !== "cutout")
  .map((p) => {
    const s = photoSet(p.id, [320, 640], true);
    return { id: p.id, src: s.src, srcSet: s.webp, avifSet: s.avif, alt: p.alt, ratio: p.ratio };
  });

export function Hero() {
  return (
    <section id="intro" aria-label="OPPAACHA" className="hero">
      <TiltedGridHero
        images={ribbon}
        columns={5}
        duration={64}
        sizes="(max-width: 767px) 32vw, 19vw"
        className="hero-ribbon intro-ribbon"
      />
      <PauseOffscreen selector=".hero-ribbon" />
      <div className="hero-light" aria-hidden />

      <div className="shell hero-body">
        <div className="hero-copy">
          <h1 className="intro-logo">
            <picture>
              <source
                type="image/avif"
                srcSet={`${asset("/media/brand/oppaacha-grunge-red-560.avif")} 560w, ${asset("/media/brand/oppaacha-grunge-red-800.avif")} 800w, ${asset("/media/brand/oppaacha-grunge-red-1400.avif")} 1400w`}
                sizes="(max-width: 767px) 78vw, 40vw"
              />
              <img
                src={asset("/media/brand/oppaacha-grunge-red.webp")}
                srcSet={`${asset("/media/brand/oppaacha-grunge-red-560.webp")} 560w, ${asset("/media/brand/oppaacha-grunge-red-800.webp")} 800w, ${asset("/media/brand/oppaacha-grunge-red.webp")} 1400w`}
                sizes="(max-width: 767px) 78vw, 40vw"
                alt="OPPAACHA"
                width={1400}
                height={1021}
                fetchPriority="high"
                className="hero-logo"
              />
            </picture>
          </h1>

          {/* no tagline yet: the line is left out (client: no visible placeholders) */}
          {isTodo(bio.tagline) ? null : (
            <p className="hero-tagline intro-line" style={{ "--i": 1 } as CSSProperties}>
              {bio.tagline}
            </p>
          )}

          <div className="hero-actions intro-line" style={{ "--i": 2 } as CSSProperties}>
            <GlassLink href="#video" tone="clear">
              <Play aria-hidden />
              Watch showreel
            </GlassLink>
            <GlassLink href="#booking" tone="primary" keep>
              Booking
              <ArrowUpRight aria-hidden />
            </GlassLink>
          </div>
        </div>

        <div className="hero-aside intro-line" style={{ "--i": 3 } as CSSProperties}>
          <HeroClip video={video("V03")} />
        </div>
      </div>

    </section>
  );
}
