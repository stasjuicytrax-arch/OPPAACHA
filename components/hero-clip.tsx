import { LiquidGlass } from "@/components/glass";
import { LoopVideo } from "@/components/loop-video";
import type { Video } from "@/lib/content";

/**
 * Hero clip: poster first, then the 6 s silent preview loop once the page
 * has settled and the clip is on screen (TECH-SPEC 5.1). The full showreel
 * lives in #video.
 */
export function HeroClip({ video }: { video: Video }) {
  return (
    <a href="#video" className="hero-clip group block" data-asset-id={video.id} aria-label={`${video.title}: watch the showreel`}>
      <LiquidGlass appearance="dark" material="clear" refraction={22} fallbackBlur={16} className="hero-clip-frame">
        <LoopVideo
          preview={video.crop?.preview ?? video.preview}
          poster={video.crop?.poster ?? video.poster}
          className="hero-clip-media"
        />
      </LiquidGlass>
      <span className="hero-clip-caption">
        <span className="label text-ink">{video.title}</span>
        <span className="label text-muted">{formatDuration(video.duration)}</span>
      </span>
    </a>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
