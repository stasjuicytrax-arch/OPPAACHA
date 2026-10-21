"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { LiquidGlass, LiquidGlassButton } from "@/components/glass";
import { LoopVideo } from "@/components/loop-video";
import type { Video } from "@/lib/content";

type Clip = Video & { src: string; poster: string };

/**
 * Showreel (TECH-SPEC 5.3). One stage, a playlist of clips beside it.
 * The stage autoplays muted only while on screen (DESIGN-SYSTEM.md 11);
 * a click walks Play, then Sound, then Pause, and the glass chip that
 * follows the pointer names the next step (5.0 cursor).
 */
export function ShowreelPlayer({ clips }: { clips: Clip[] }) {
  const [index, setIndex] = React.useState(0);
  const clip = clips[index];
  const others = clips.filter((_, i) => i !== index);

  const stageRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const userPaused = React.useRef(false);
  const reduce = useReducedMotion();

  // Play while visible, pause off screen; reduced motion waits for a click.
  React.useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    if (!v || !stage) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!userPaused.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [index]);

  const toggle = React.useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else if (v.muted && clip.hasAudio) {
      v.muted = false;
      setMuted(false);
    } else {
      userPaused.current = true;
      v.pause();
    }
  }, [clip.hasAudio]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v || !clip.hasAudio) return;
    v.muted = !v.muted;
    setMuted(v.muted);
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

  const select = (id: string) => {
    const next = clips.findIndex((c) => c.id === id);
    if (next < 0) return;
    userPaused.current = false;
    setIndex(next);
    setProgress(0);
    setTime(0);
    stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
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
    <div className="reel-layout">
      <div
        ref={stageRef}
        className="reel-stage"
        data-asset-id={clip.id}
        onPointerMove={onMove}
        onPointerEnter={(e) => e.pointerType === "mouse" && setChip(true)}
        onPointerLeave={() => setChip(false)}
      >
        <video
          key={clip.id}
          ref={videoRef}
          className="reel-video"
          poster={`${clip.poster}.webp`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${clip.title}, video`}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
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
              className="reel-chip"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              aria-hidden
            >
              <LiquidGlass appearance="dark" material="regular" refraction={10} fallbackBlur={14} className="reel-chip-glass label">
                {chipLabel}
              </LiquidGlass>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <LiquidGlass appearance="dark" material="regular" refraction={20} fallbackBlur={18} className="reel-panel">
          <LiquidGlassButton
            size={null}
            interactive
            appearance="dark"
            material="clear"
            refraction={6}
            className="reel-btn"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              if (v.paused) {
                userPaused.current = false;
                v.play().catch(() => {});
              } else {
                userPaused.current = true;
                v.pause();
              }
            }}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
          </LiquidGlassButton>

          <div
            className="reel-track"
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
            <span className="reel-track-fill" style={{ transform: `scaleX(${progress})` }} />
          </div>

          <span className="label reel-time">
            {fmt(time)} / {fmt(clip.duration)}
          </span>

          <LiquidGlassButton
            size={null}
            interactive
            appearance="dark"
            material="clear"
            refraction={6}
            className="reel-btn"
            aria-label={!clip.hasAudio ? "This clip has no sound" : muted ? "Sound on" : "Sound off"}
            aria-pressed={clip.hasAudio ? !muted : undefined}
            disabled={!clip.hasAudio}
            onClick={toggleSound}
          >
            {muted || !clip.hasAudio ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
          </LiquidGlassButton>
          <LiquidGlassButton
            size={null}
            interactive
            appearance="dark"
            material="clear"
            refraction={6}
            className="reel-btn"
            aria-label="Full screen"
            onClick={fullscreen}
          >
            <Maximize2 aria-hidden />
          </LiquidGlassButton>
        </LiquidGlass>
      </div>

      <div className="reel-side">
        <p className="reel-now">
          <span className="label text-muted">Now playing</span>
          <span className="reel-now-title">{clip.title}</span>
        </p>
        {others.map((c) => (
          <button key={c.id} type="button" className="reel-card" data-asset-id={c.id} onClick={() => select(c.id)}>
            <LoopVideo preview={c.preview} poster={c.poster} className="reel-card-media" />
            <span className="reel-card-caption">
              <span className="label text-ink">{c.title}</span>
              <span className="label text-muted">{fmt(c.duration)}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
