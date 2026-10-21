import type { CSSProperties } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { GlassLink } from "@/components/glass";
import { HeroClip } from "@/components/hero-clip";
import { bio, isTodo, photoSrc, photos, video, TODO } from "@/lib/content";

// Every photo except the cut-out, which waits for its own moment in #photo.
const ribbon = photos
  .filter((p) => p.kind !== "cutout")
  .map((p) => {
    const s = photoSrc(p.id);
    return { id: p.id, src: s.webp, avif: s.avif, alt: p.alt, ratio: p.ratio };
  });

export function Hero() {
  return (
    <section id="intro" aria-label="OPPAACHA" className="hero">
      <TiltedGridHero images={ribbon} columns={5} duration={64} className="hero-ribbon intro-ribbon" />
      <div className="hero-light" aria-hidden />

      <div className="shell hero-body">
        <div className="hero-copy">
          <h1 className="intro-logo">
            <img
              src="/media/brand/oppaacha-grunge-red.webp"
              alt="OPPAACHA"
              width={1400}
              height={1021}
              fetchPriority="high"
              className="hero-logo"
            />
          </h1>

          {isTodo(bio.tagline) ? (
            <p className="hero-tagline intro-line todo-slot" style={{ "--i": 1 } as CSSProperties}>
              {TODO}: tagline
            </p>
          ) : (
            <p className="hero-tagline intro-line" style={{ "--i": 1 } as CSSProperties}>
              {bio.tagline}
            </p>
          )}

          <div className="hero-actions intro-line" style={{ "--i": 2 } as CSSProperties}>
            <GlassLink href="#video" tone="clear">
              <Play aria-hidden />
              Watch showreel
            </GlassLink>
            <GlassLink href="#booking" tone="primary">
              Booking
              <ArrowUpRight aria-hidden />
            </GlassLink>
          </div>
        </div>

        <div className="hero-aside intro-line" style={{ "--i": 3 } as CSSProperties}>
          <HeroClip video={video("V03")} />
        </div>
      </div>

      <img src="/media/brand/oppaacha-wordmark-ink.webp" alt="" aria-hidden width={2400} height={519} className="hero-underlay" />
    </section>
  );
}
