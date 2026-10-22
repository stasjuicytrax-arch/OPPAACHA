"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { LiquidGlass, LiquidGlassButton, isLite } from "@/components/glass";
import type { Video } from "@/lib/content";

export type PlayableClip = Video & { src: string; poster: string };

/**
 * One video on a glass-framed stage: glass control panel with a red
 * progress line, sound on request, full screen, and a glass chip that
 * follows the pointer naming the next step (Play, Sound, Pause).
 *
 * mode "inview": autoplays muted only while on screen.
 * mode "manual": poster and preload="none" until a tap; metadata loads on
 *                entering the viewport (showreel diptych).
 * Only one stage plays at a time: starting one pauses the others.
 * The picture is contained (never cropped); a blurred poster fills any
 * letterbox around a clip that is not 9:16.
 * mode "open":   starts at once with sound, as the click that opened it
 *                is the user's request (Live lightbox).
 */
export function GlassStage({
  clip,
  mode = "inview",
  className,
}: {
  clip: PlayableClip;
  mode?: "inview" | "open" | "manual";
  className?: string;
}) {
  // lite devices: nothing preloads until a tap (performance, 22.10.2026)
  const [lite, setLite] = React.useState(false);
  React.useEffect(() => setLite(isLite()), []);
  // the open lightbox outranks everything for a refraction slot
  const stagePriority = mode === "open" ? 9 : 5;
  const stageRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(mode !== "open" || !clip.hasAudio);
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const userPaused = React.useRef(false);
  const uid = React.useId();

  // one stage plays at a time across the page
  React.useEffect(() => {
    const onOther = (e: Event) => {
      const v = videoRef.current;
      if ((e as CustomEvent<string>).detail !== uid && v && !v.paused) v.pause();
    };
    window.addEventListener("stage-play", onOther);
    return () => window.removeEventListener("stage-play", onOther);
  }, [uid]);

  React.useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    if (!v || !stage) return;
    userPaused.current = false;
    setProgress(0);
    setTime(0);
    if (mode === "open") {
      v.muted = !clip.hasAudio;
      v.play().catch(() => {
        // autoplay with sound refused: fall back to muted
        v.muted = true;
        v.play().catch(() => {});
      });
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (mode === "manual") {
          if (e.isIntersecting) {
            if (!isLite() && v.preload === "none") v.preload = "metadata";
          } else if (!v.paused) v.pause();
          return;
        }
        if (e.isIntersecting) {
          // phones and weak devices: poster until a tap (performance, 22.10.2026)
          if (!userPaused.current && !isLite() && !matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [clip.id, clip.hasAudio, mode]);

  const playPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  // click on the picture: Play, then Sound, then Pause
  const step = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) playPause();
    else if (v.muted && clip.hasAudio) v.muted = false;
    else playPause();
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v || !clip.hasAudio) return;
    v.muted = !v.muted;
    if (v.paused) v.play().catch(() => {});
  };

  const fullscreen = () => {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.();
  };

  const seek = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * v.duration;
  };
  const seekKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (e.key === "ArrowRight") v.currentTime = Math.min(v.duration, v.currentTime + 5);
    else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
    else return;
    e.preventDefault();
  };

  // glass chip following the pointer
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(cy, { stiffness: 500, damping: 40, mass: 0.4 });
  const [chip, setChip] = React.useState(false);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = stageRef.current!.getBoundingClientRect();
    cx.set(e.clientX - r.left);
    cy.set(e.clientY - r.top);
  };
  const chipLabel = !playing ? "Play" : muted && clip.hasAudio ? "Sound" : "Pause";

  return (
    <div
      ref={stageRef}
      className={["stage", className].filter(Boolean).join(" ")}
      style={{ aspectRatio: String(clip.aspect ?? 9 / 16) }}
      data-asset-id={clip.id}
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === "mouse" && setChip(true)}
      onPointerLeave={() => setChip(false)}
    >
      {/* blurred poster behind a contained picture: fills letterboxes, never a second video */}
      <img className="stage-backdrop" src={`${clip.poster}-480.webp`} alt="" aria-hidden decoding="async" loading="lazy" />
      <video
        key={clip.id}
        ref={videoRef}
        className="stage-video"
        poster={`${clip.poster}.webp`}
        muted={mode !== "open"}
        loop
        playsInline
        preload={lite || mode === "manual" ? "none" : "metadata"}
        aria-label={`${clip.title}, video`}
        onClick={step}
        onPlay={() => {
          setPlaying(true);
          window.dispatchEvent(new CustomEvent("stage-play", { detail: uid }));
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setTime(v.currentTime);
          setProgress(v.duration ? v.currentTime / v.duration : 0);
        }}
      >
        <source src={`${clip.src}-1080.mp4`} type="video/mp4" media="(min-width: 768px)" />
        <source src={`${clip.src}-720.mp4`} type="video/mp4" />
      </video>

      <AnimatePresence>
        {chip ? (
          <motion.div
            className="stage-chip"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            aria-hidden
          >
            <LiquidGlass priority={2} appearance="dark" material="regular" refraction={10} fallbackBlur={14} className="stage-chip-glass label">
              {chipLabel}
            </LiquidGlass>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <LiquidGlass priority={stagePriority} appearance="dark" material="regular" refraction={20} fallbackBlur={18} className="stage-panel">
        <LiquidGlassButton
          priority={2}
          size={null}
          interactive
          appearance="dark"
          material="clear"
          refraction={6}
          className="stage-btn"
          aria-label={playing ? "Pause" : "Play"}
          onClick={playPause}
        >
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        </LiquidGlassButton>

        <div
          className="stage-track"
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(clip.duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${fmt(time)} of ${fmt(clip.duration)}`}
          onPointerDown={seek}
          onKeyDown={seekKey}
        >
          <span className="stage-track-fill" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <span className="label stage-time">
          {fmt(time)} / {fmt(clip.duration)}
        </span>

        <LiquidGlassButton
          priority={2}
          size={null}
          interactive
          appearance="dark"
          material="clear"
          refraction={6}
          className="stage-btn"
          aria-label={!clip.hasAudio ? "This clip has no sound" : muted ? "Sound on" : "Sound off"}
          aria-pressed={clip.hasAudio ? !muted : undefined}
          disabled={!clip.hasAudio}
          onClick={toggleSound}
        >
          {muted || !clip.hasAudio ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
        </LiquidGlassButton>
        <LiquidGlassButton
          priority={2}
          size={null}
          interactive
          appearance="dark"
          material="clear"
          refraction={6}
          className="stage-btn"
          aria-label="Full screen"
          onClick={fullscreen}
        >
          <Maximize2 aria-hidden />
        </LiquidGlassButton>
      </LiquidGlass>
    </div>
  );
}

export function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
