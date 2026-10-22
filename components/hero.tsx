import type { CSSProperties } from "react";
import { ArrowUpRight, Headphones, Play } from "lucide-react";
import { GlassLink } from "@/components/glass";
import { LoopVideo } from "@/components/loop-video";
import { asset, bio, stillSet, video } from "@/lib/content";

/**
 * Hero (client brief 22.10.2026, block 1): a concert shot at the foot of
 * Mount Batur instead of the photo collage: the still paints first, the
 * Batur loop fades in over it once the page has loaded (desktop only).
 * Roles, genres, the labels the music came out on, then Listen · Watch ·
 * Booking.
 */
export function Hero() {
  const h = bio.hero;
  const clip = video(h.video);
  // the sharpest frame of the opening wide shot, from the original (scripts/media.mjs heroStill)
  const still = stillSet(h.poster, [960, 1440, 1920]);

  return (
    <section id="intro" aria-label="OPPAACHA" className="hero">
      <div className="hero-media" aria-hidden>
        <picture>
          <source type="image/avif" srcSet={still.avif} sizes="100vw" />
          <img src={`${asset(h.poster)}-1920.webp`} srcSet={still.webp} sizes="100vw" alt="" width={1920} height={1080} fetchPriority="high" decoding="async" className="hero-still" />
        </picture>
        {/* 10 s silent 1080p loop over the still; never on lite devices (LoopVideo) */}
        {h.loop ? <LoopVideo preview={asset(h.loop)} poster={null} className="hero-video" /> : null}
      </div>
      <div className="hero-light" aria-hidden />

      <div className="shell hero-body">
        <div className="hero-copy">
          <h1 className="intro-logo">
            <picture>
              <source
                type="image/avif"
                srcSet={`${asset("/media/brand/oppaacha-grunge-red-560.avif")} 560w, ${asset("/media/brand/oppaacha-grunge-red-800.avif")} 800w, ${asset("/media/brand/oppaacha-grunge-red-1400.avif")} 1400w`}
                sizes="(max-width: 767px) 70vw, 34vw"
              />
              <img
                src={asset("/media/brand/oppaacha-grunge-red.webp")}
                srcSet={`${asset("/media/brand/oppaacha-grunge-red-560.webp")} 560w, ${asset("/media/brand/oppaacha-grunge-red-800.webp")} 800w, ${asset("/media/brand/oppaacha-grunge-red.webp")} 1400w`}
                sizes="(max-width: 767px) 70vw, 34vw"
                alt="OPPAACHA"
                width={1400}
                height={1021}
                className="hero-logo"
              />
            </picture>
          </h1>

          <p className="hero-roles intro-line" style={{ "--i": 1 } as CSSProperties}>
            {h.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </p>
          <p className="hero-genres label intro-line" style={{ "--i": 2 } as CSSProperties}>
            {h.genres}
          </p>

          <div className="hero-actions intro-line" style={{ "--i": 3 } as CSSProperties}>
            <GlassLink href="#releases" tone="clear">
              <Headphones aria-hidden />
              Listen
            </GlassLink>
            <GlassLink href="#live" tone="clear">
              <Play aria-hidden />
              Watch
            </GlassLink>
            <GlassLink href="#booking" tone="primary" keep>
              Booking
              <ArrowUpRight aria-hidden />
            </GlassLink>
          </div>
        </div>

        <div className="hero-labels intro-line" style={{ "--i": 4 } as CSSProperties}>
          <p className="label text-muted">Releases on</p>
          {/* names stand in until the official logos arrive */}
          <ul className="hero-label-row">
            {h.releasesOn.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          {clip.place ? <p className="hero-place label">{clip.place}</p> : null}
        </div>
      </div>
    </section>
  );
}
