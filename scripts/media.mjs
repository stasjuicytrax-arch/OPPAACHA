#!/usr/bin/env node
// Media pipeline: originals stay on disk (source-media/ or the client's
// "Все что нужно тут" folder) and never enter git. Derivatives land in
// public/media and are referenced from content/*.json.
//
//   node scripts/media.mjs            # everything the built blocks need
//   node scripts/media.mjs --only=hero
//
// Requires ffmpeg on PATH for video. Photos and logos go through sharp.

import { existsSync, mkdirSync, statSync } from "node:fs";
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
// Photos: AVIF + WebP at fixed widths, plus a tiny blur placeholder.
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
}

// --------------------------------------------------------------------------
// Video: poster + 6 s silent preview loop. Full encodes come with block 3.
// --------------------------------------------------------------------------

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

// crop: optional ffmpeg crop before scaling. V03 is a vertical triptych; its
// middle band (OPPAACHA at the decks) is a 1080x640 landscape shot.
export const PREVIEWS = {
  V03: { file: "Video/Profi/_Los Goodman_ at  Desa Kitsuné.mp4", start: 16.5, crop: "1080:640:0:640" },
};

async function videoPreview(id) {
  const { file, start, crop } = PREVIEWS[id];
  const pre = crop ? `crop=${crop},` : "";
  const input = src(file);
  const preview = out("video", `${id}-preview.mp4`);
  if (!fresh(preview)) {
    ffmpeg([
      "-ss", String(start), "-t", "6", "-i", input, "-an",
      "-vf", `${pre}scale=-2:720:flags=lanczos,fps=25`,
      "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-maxrate", "2400k", "-bufsize", "4800k",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", preview,
    ]);
    console.log(`video ${id} preview ${kb(preview)}`);
  }
  const png = out("video", `${id}-poster.png`);
  if (!fresh(out("video", `${id}-poster.webp`))) {
    ffmpeg(["-ss", String(start), "-i", input, "-frames:v", "1", "-vf", `${pre}scale=1280:-2:flags=lanczos`, png]);
    await sharp(png).avif({ quality: 50 }).toFile(out("video", `${id}-poster.avif`));
    await sharp(png).webp({ quality: 72 }).toFile(out("video", `${id}-poster.webp`));
    const { rmSync } = await import("node:fs");
    rmSync(png);
    console.log(`video ${id} poster ${kb(out("video", `${id}-poster.avif`))}`);
  }
}

// --------------------------------------------------------------------------

const tasks = {
  hero: async () => {
    await logos();
    await photos([640]);
    await videoPreview("V03");
  },
};

for (const [name, run] of Object.entries(tasks)) {
  if (only && only !== name) continue;
  console.log(`\n== ${name}`);
  await run();
}
