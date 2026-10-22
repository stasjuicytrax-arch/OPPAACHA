#!/usr/bin/env node
// Brief media (CLIENT-EDITS-2026-10-22.md): release covers from Spotify oEmbed
// and the stills, posters and chart screenshots in client-brief/. The
// originals stay out of git; AVIF + WebP derivatives land in public/media.
//
//   node scripts/brief-media.mjs [--force]

import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BRIEF = path.join(ROOT, "client-brief");
const OUT = path.join(ROOT, "public", "media");
const force = process.argv.includes("--force");

const out = (...p) => {
  const file = path.join(OUT, ...p);
  mkdirSync(path.dirname(file), { recursive: true });
  return file;
};
const fresh = (file) => !force && existsSync(file) && statSync(file).size > 0;

/** AVIF + WebP at each width (never upscaled), named <base>-<width>.<ext>. */
async function variants(input, base, widths) {
  const meta = await sharp(input).metadata();
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    for (const [ext, opts] of [
      ["avif", { quality: 58, effort: 6 }],
      ["webp", { quality: 80 }],
    ]) {
      const file = out(`${base}-${w}.${ext}`);
      if (fresh(file)) continue;
      await sharp(input).resize({ width })[ext](opts).toFile(file);
    }
  }
  console.log(`${base}: ${meta.width}x${meta.height}`);
}

// Release covers: oEmbed thumbnail_url is the 300px image; the same image id
// with the 640px size prefix is Spotify's large cover.
const { releases } = JSON.parse(readFileSync(path.join(ROOT, "content", "releases.json"), "utf8"));
for (const r of releases) {
  const target = out(`release/${r.id}-640.webp`);
  if (fresh(target)) continue;
  const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(r.url)}`);
  const { thumbnail_url } = await res.json();
  const large = thumbnail_url.replace(/ab67616d0000[0-9a-f]{4}/, "ab67616d0000b273");
  const img = Buffer.from(await (await fetch(large)).arrayBuffer());
  await variants(img, `release/${r.id}`, [320, 640]);
}

// Stills, posters and charts from the brief.
const STILLS = [
  ["batur-hero-frame-1920x1080.jpg", "brief/batur-hero", [640, 1280, 1920]],
  ["camelphat-in-my-hands-frame.jpg", "brief/camelphat-in-my-hands", [480, 720]],
  ["chart-diynamic-1-position-8.jpg", "brief/chart-diynamic-1", [480, 1006]],
  ["chart-diynamic-2-position-10.jpg", "brief/chart-diynamic-2", [480, 976]],
  ["poster-australian-tour.jpg", "brief/poster-australian-tour", [480, 1080]],
  ["poster-siriusxm-ocho.png", "brief/poster-siriusxm", [480, 1200]],
  ["poster-insomniac-radio.jpg", "brief/poster-insomniac", [480, 1200]],
];
if (!existsSync(BRIEF)) {
  console.error("client-brief/ not found: stills skipped.");
  process.exit(0);
}
for (const [file, base, widths] of STILLS) {
  await variants(path.join(BRIEF, file), base, widths);
}
