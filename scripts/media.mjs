#!/usr/bin/env node
// Media pipeline: originals stay on disk (source-media/ or the client's
// "Все что нужно тут" folder) and never enter git. Derivatives land in
// public/media and are referenced from content/*.json.
//
//   node scripts/media.mjs            # everything the built blocks need
//   node scripts/media.mjs --only=hero
//
// Requires ffmpeg on PATH for video. Photos and logos go through sharp.

import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = ["source-media", "Все что нужно тут"]
  .map((d) => path.join(ROOT, d))
  .find((d) => existsSync(d));
if (!SOURCE) {
  console.error("No source folder found (source-media/ or 'Все что нужно тут/').");
  process.exit(1);
}
const OUT = path.join(ROOT, "public", "media");
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];
const force = process.argv.includes("--force");

const src = (...p) => path.join(SOURCE, ...p);
const out = (...p) => {
  const file = path.join(OUT, ...p);
  mkdirSync(path.dirname(file), { recursive: true });
  return file;
};
const fresh = (file) => !force && existsSync(file) && statSync(file).size > 0;
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`;

// --------------------------------------------------------------------------
// Photos: AVIF + WebP at fixed widths.
// --------------------------------------------------------------------------

export const PHOTOS = [
  ["P01", "Live/10 LUNO CLEAN-37.jpg"],
  ["P02", "Live/IMG_1878.JPG"],
  ["P03", "Live/KAWK0048.jpg"],
  ["P04", "Live/KAWK0066.jpg"],
  ["P05", "Live/KRS07494-Enhanced-NR.jpg"],
  ["P06", "Studio/DSC01487 (1).jpg"],
  ["P07", "Studio/DSC01713.jpg"],
  ["P08", "Studio/DSC01773.jpg"],
  ["P09", "Studio/IMG_6486.jpeg"],
  ["P10", "Studio/IMG_6613.jpeg"],
  ["P11", "Studio/IMG_6660.jpeg"],
  ["P12", "Studio/IMG_6758.jpeg"],
  ["P13", "Studio/Without bg.png"],
];

async function photos(widths) {
  for (const [id, file] of PHOTOS) {
    const input = src("Photo", file);
    const alpha = file.endsWith(".png");
    for (const w of widths) {
      for (const fmt of ["avif", "webp"]) {
        const target = out("photo", `${id}-${w}.${fmt}`);
        if (fresh(target)) continue;
        await sharp(input)
          .rotate()
          .resize({ width: w, withoutEnlargement: true })
          [fmt]({ quality: fmt === "avif" ? 52 : 74, effort: 5, alphaQuality: alpha ? 80 : undefined })
          .toFile(target);
        console.log(`photo ${id} ${w} ${fmt} ${kb(target)}`);
      }
    }
  }
}

// --------------------------------------------------------------------------
// Logos: trimmed (the PNGs are 8000x4500 with transparent padding).
// --------------------------------------------------------------------------

async function logos() {
  const jobs = [
    // Hero mark: the grunge colored stack, as delivered.
    ["oppaacha-grunge-red", "oppaacha_logo_grunge_colored.png", null, 1400],
    // Giant underlay: the horizontal wordmark recoloured to --ink.
    ["oppaacha-wordmark-ink", "oppaacha_logo_additional_colored_1.png", "#F4F2EE", 2400],
    // Nav monogram: the accented "ó" from the additional set.
    ["oppaacha-mark-red", "oppaacha_logo_additional_colored_2.png", null, 160],
  ];
  for (const [name, file, recolor, width] of jobs) {
    const target = out("brand", `${name}.webp`);
    if (fresh(target)) continue;
    const trimmed = await sharp(src("Identify", "png", file)).trim().png().toBuffer();
    const sized = await sharp(trimmed)
      .resize({ width, withoutEnlargement: true })
      .png()
      .toBuffer({ resolveWithObject: true });
    let img = sharp(sized.data);
    if (recolor) {
      const { width: w, height: h } = sized.info;
      const alpha = await sharp(sized.data).extractChannel("alpha").raw().toBuffer();
      img = sharp({ create: { width: w, height: h, channels: 3, background: recolor } })
        .joinChannel(alpha, { raw: { width: w, height: h, channels: 1 } });
    }
    await img.webp({ quality: 90, alphaQuality: 90 }).toFile(target);
    await sharp(target).png({ compressionLevel: 9 }).toFile(out("brand", `${name}.png`));
    const meta = await sharp(target).metadata();
    console.log(`logo ${name} ${meta.width}x${meta.height} ${kb(target)}`);
  }

  // Underlay variant without the accent slab over the A: as a giant cropped
  // word the accent reads as a stray grey block (finish review, 21.10.2026).
  // The accent fills the top 26% of the wordmark; letters start at 34%.
  const flat = out("brand", "oppaacha-wordmark-flat.webp");
  if (!fresh(flat)) {
    const ink = sharp(out("brand", "oppaacha-wordmark-ink.png"));
    const { width: w, height: h } = await ink.metadata();
    const top = Math.round(h * 0.3);
    await sharp(out("brand", "oppaacha-wordmark-ink.png"))
      .extract({ left: 0, top, width: w, height: h - top })
      .webp({ quality: 90, alphaQuality: 90 })
      .toFile(flat);
    console.log(`logo oppaacha-wordmark-flat ${w}x${h - top} ${kb(flat)}`);
  }
}

// --------------------------------------------------------------------------
// Video. Per clip: full encodes <id>-1080.mp4 / <id>-720.mp4 (H.264, CRF
// 24-25, +faststart), a 6 s silent preview loop and a poster (AVIF + WebP).
// A crop variant (suffix -crop) serves a landscape slice of a vertical clip.
// --------------------------------------------------------------------------

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

// start: first second of the preview; the poster is taken one second later.
// crop: V03 is a vertical triptych; its middle band (OPPAACHA at the decks)
// is a 1080x640 landscape shot used by the hero and the manifesto pill.
export const CLIPS = {
  V02: { file: "Video/Profi/dr17.mp4", start: 2 },
  V03: { file: "Video/Profi/_Los Goodman_ at  Desa Kitsuné.mp4", start: 16.5, crop: "1080:640:0:640" },
  V04: { file: "Video/Live/Trip Main Stage.MOV", start: 13 },
  V05: { file: "Video/Live/Savaya Bali.mov", start: 4 },
  V06: { file: "Video/Live/_True_ Bali Savaya.mov", start: 41 },
  V07: { file: "Video/Live/_Los Goodman_ at Gioli&Assia 2 [Savaya Bali].mov", start: 7 },
  V08: { file: "Video/Live/Flava Back.MOV", start: 1 },
  // Support. V01 runs 3 min: TECH-SPEC 4 allows up to 25 MB for the long clips.
  V01: { file: "Support/Tomorrowland_Main_Oppaacha_Umbrella.mp4", start: 159.6, budget: [21500, 13000] },
  V09: { file: "Support/Oppaacha - Umbrealla Zürich 1.MOV", start: 7 },
  V10: { file: "Support/Adriatique (Oppaacha - My Soul).MP4", start: 3 },
  V11: { file: "Support/CamelPhat (Don_t Stop) 1.MP4", start: 25 },
  V12: { file: "Support/Solomun 3.MP4", start: 4 },
};

async function poster(input, at, vf, name) {
  if (fresh(out("video", `${name}.webp`))) return;
  const png = out("video", `${name}.png`);
  ffmpeg(["-ss", String(at), "-i", input, "-frames:v", "1", "-vf", vf, png]);
  await sharp(png).avif({ quality: 50 }).toFile(out("video", `${name}.avif`));
  await sharp(png).webp({ quality: 72 }).toFile(out("video", `${name}.webp`));
  rmSync(png);
  console.log(`video ${name} ${kb(out("video", `${name}.avif`))}`);
}

function preview(input, at, vf, name) {
  const target = out("video", `${name}.mp4`);
  if (fresh(target)) return;
  ffmpeg([
    "-ss", String(at), "-t", "6", "-i", input, "-an", "-vf", vf,
    "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-maxrate", "2400k", "-bufsize", "4800k",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", target,
  ]);
  console.log(`video ${name} ${kb(target)}`);
}

/**
 * short: target short side in px (1080 or 720), whatever the orientation;
 * never above the source. budget: [kB at 1080, kB at 720] for long clips.
 */
function encode(input, short, name, budget = [10800, 6400]) {
  const target = out("video", `${name}.mp4`);
  if (fresh(target)) return;
  const dims = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", input])
    .toString().trim().split(",").map(Number);
  short = Math.min(short, Math.min(...dims));
  const scale = `scale='if(gt(iw,ih),-2,${short})':'if(gt(iw,ih),${short},-2)':flags=lanczos`;
  // size budget per file (TECH-SPEC 4: <= 12 MB for 30-60 s): ~11 MB at 1080,
  // ~6.5 MB at 720, whatever the length
  const seconds = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", input]).toString()
  );
  const kbps = (budgetKb, cap) => `${Math.min(cap, Math.floor((budgetKb * 8) / seconds))}k`;
  const maxrate = short > 720 ? kbps(budget[0], 2800) : kbps(budget[1], 1700);
  ffmpeg([
    "-i", input, "-vf", `${scale},fps=30`,
    "-c:v", "libx264", "-preset", "slow", "-crf", short > 720 ? "24" : "25", "-profile:v", "high",
    // caps keep a 30 s clip near 11 MB (1080) and 7 MB (720), TECH-SPEC 4
    "-maxrate", maxrate, "-bufsize", `${parseInt(maxrate, 10) * 2}k`,
    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", target,
  ]);
  console.log(`video ${name} ${kb(target)}`);
}

async function clip(id, { full = true, crop = true } = {}) {
  const c = CLIPS[id];
  const input = src(c.file);
  if (crop && c.crop) {
    preview(input, c.start, `crop=${c.crop},scale=-2:720:flags=lanczos,fps=25`, `${id}-crop-preview`);
    await poster(input, c.start, `crop=${c.crop},scale=1280:-2:flags=lanczos`, `${id}-crop-poster`);
  }
  if (!full) return;
  preview(input, c.start, "scale=-2:720:flags=lanczos,fps=25", `${id}-preview`);
  await poster(input, c.start + 1, "scale=900:-2:flags=lanczos", `${id}-poster`);
  encode(input, 1080, `${id}-1080`, c.budget);
  encode(input, 720, `${id}-720`, c.budget);
}

// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// Performance variants (22.10.2026): looks that used to be CSS filters on
// big or animated layers are baked into the pixels, and smaller widths feed
// srcset so phones never download desktop sizes.
// --------------------------------------------------------------------------

async function toBoth(pipeline, base, label) {
  if (fresh(`${base}.webp`)) return;
  const buf = await pipeline.toBuffer();
  await sharp(buf).avif({ quality: 50 }).toFile(`${base}.avif`);
  await sharp(buf).webp({ quality: 72 }).toFile(`${base}.webp`);
  console.log(`perf ${label} ${kb(`${base}.webp`)}`);
}

async function perf() {
  // Hero ribbon: was filter grayscale(1) contrast(1.08) brightness(0.86) on
  // the whole animated layer. ((x * 0.86) - 0.5) * 1.08 + 0.5 = 0.929x - 0.04
  for (const [id, file] of PHOTOS) {
    if (id === "P13") continue;
    for (const w of [320, 640]) {
      const pipe = sharp(src("Photo", file)).rotate().resize({ width: w }).greyscale().linear(0.929, -10.2);
      await toBoth(pipe, out("photo", `${id}-g-${w}`), `${id} grey ${w}`);
    }
    // 320 colour for srcset on small tiles
    const pipe = sharp(src("Photo", file)).rotate().resize({ width: 320 });
    await toBoth(pipe, out("photo", `${id}-320`), `${id} 320`);
  }
  // Rider backdrop: was grayscale(1) brightness(0.42) contrast(1.1).
  // ((x * 0.42) - 0.5) * 1.1 + 0.5 = 0.462x + 0.05
  for (const w of [640, 1280]) {
    const pipe = sharp(src("Photo", "Live/KAWK0048.jpg")).rotate().resize({ width: w }).greyscale().linear(0.462, 12.75);
    await toBoth(pipe, out("photo", `P03-rider-${w}`), `rider backdrop ${w}`);
  }
  // Showreel ambient: was blur(90px) saturate(1.5) brightness(0.42) on a
  // full-section layer. A 48 px frame, upscaled by the browser, is the blur.
  const ambient = out("video", "V03-ambient.webp");
  if (!fresh(ambient)) {
    await sharp(out("video", "V03-poster.webp")).resize({ width: 48 }).blur(1.2).modulate({ saturation: 1.5, brightness: 0.42 }).webp({ quality: 80 }).toFile(ambient);
    console.log(`perf ambient ${kb(ambient)}`);
  }
  // Posters at 480 for cards (they show at 240-360 css px)
  for (const id of ["V01", "V02", "V04", "V05", "V06", "V07", "V08", "V09", "V10", "V11", "V12"]) {
    const posterSrc = out("video", `${id}-poster.webp`);
    if (!existsSync(posterSrc)) continue;
    await toBoth(sharp(posterSrc).resize({ width: 480 }), out("video", `${id}-poster-480`), `${id} poster 480`);
  }
  await toBoth(sharp(out("video", "V03-poster.webp")).resize({ width: 480 }), out("video", "V03-poster-480"), "V03 poster 480");
  await toBoth(sharp(out("video", "V03-crop-poster.webp")).resize({ width: 640 }), out("video", "V03-crop-poster-640"), "V03 crop poster 640");
  // The hero mark is the LCP: AVIF at three widths, WebP 560 for phones
  for (const w of [560, 800, 1400]) {
    const target = out("brand", `oppaacha-grunge-red-${w}.avif`);
    if (fresh(target)) continue;
    await sharp(out("brand", "oppaacha-grunge-red.png")).resize({ width: w }).avif({ quality: 55, effort: 6 }).toFile(target);
    console.log(`perf grunge-red ${w} avif ${kb(target)}`);
  }
  const red560 = out("brand", "oppaacha-grunge-red-560.webp");
  if (!fresh(red560)) await sharp(out("brand", "oppaacha-grunge-red.png")).resize({ width: 560 }).webp({ quality: 85, alphaQuality: 90 }).toFile(red560);
  // Brand marks at phone sizes
  for (const [name, w] of [["oppaacha-grunge-red", 800], ["oppaacha-wordmark-flat", 1200]]) {
    const target = out("brand", `${name}-${w}.webp`);
    if (fresh(target)) continue;
    await sharp(out("brand", `${name}.webp`)).resize({ width: w }).webp({ quality: 88, alphaQuality: 90 }).toFile(target);
    console.log(`perf ${name} ${w} ${kb(target)}`);
  }
}

const tasks = {
  perf,
  hero: async () => {
    await logos();
    await photos([640]);
    await clip("V03", { full: false });
  },
  showreel: async () => {
    await clip("V03");
    await clip("V02");
  },
  live: async () => {
    for (const id of ["V04", "V05", "V06", "V07", "V08"]) await clip(id);
  },
  photo: async () => {
    await photos([640, 1280]);
  },
  support: async () => {
    for (const id of ["V01", "V09", "V10", "V11", "V12"]) await clip(id);
  },
};

for (const [name, run] of Object.entries(tasks)) {
  if (only && only !== name) continue;
  console.log(`\n== ${name}`);
  await run();
}
