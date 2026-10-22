"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { LiquidGlass, isLite } from "@/components/glass";
import { LoopVideo } from "@/components/loop-video";
import type { Video } from "@/lib/content";

/**
 * Hero clip: poster first, then the 6 s silent preview loop once the page
 * has settled and the clip is on screen (TECH-SPEC 5.1). On phones and weak
 * devices nothing autoplays: the first tap starts the preview in place
 * (a play mark says so), the next tap goes to the showreel in #video.
 */
export function HeroClip({ video }: { video: Video }) {
  const [lite, setLite] = React.useState(false);
  const [tapped, setTapped] = React.useState(false);
  React.useEffect(() => setLite(isLite()), []);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (lite && !tapped) {
      e.preventDefault();
      setTapped(true);
    }
  };

  return (
    <a
      href="#video"
      className="hero-clip group block"
      data-asset-id={video.id}
      aria-label={lite && !tapped ? `${video.title}: play the preview` : `${video.title}: watch the showreel`}
      onClick={onClick}
    >
      <LiquidGlass priority={5} appearance="dark" material="clear" refraction={22} fallbackBlur={16} className="hero-clip-frame">
        <LoopVideo
          preview={video.crop?.preview ?? video.preview}
          poster={video.crop?.poster ?? video.poster}
          active={lite ? tapped : undefined}
          className="hero-clip-media"
        />
        {lite && !tapped ? (
          <span className="hero-clip-play" aria-hidden>
            <Play />
          </span>
        ) : null}
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
