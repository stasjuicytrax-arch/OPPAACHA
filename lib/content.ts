import videosJson from "@/content/videos.json";
import photosJson from "@/content/photos.json";
import bioJson from "@/content/bio.json";
import sectionsJson from "@/content/sections.json";
import releasesJson from "@/content/releases.json";
import radioJson from "@/content/radio.json";
import contactsJson from "@/content/contacts.json";

export const TODO = "TODO_FROM_PROMOKIT";

/** Site prefix when served from a subpath (GitHub Pages: /OPPAACHA). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => (p.startsWith("/") ? BASE + p : p);
const assetOrNull = (p: string | null) => (p ? asset(p) : p);

export type Video = {
  id: string;
  title: string;
  venue: string;
  section: string;
  source: string;
  orientation: "landscape" | "portrait";
  src: string | null;
  preview: string | null;
  /** Path without extension; .avif and .webp exist side by side. */
  poster: string | null;
  /** seconds; 0 while the original is still on drive */
  duration: number;
  hasAudio: boolean;
  /** landscape slice of a vertical clip, same shape as preview/poster */
  crop?: { preview: string; poster: string };
  /** width / height of the picture; 9/16 when absent */
  aspect?: number;
  /** Support: who plays the track, and where */
  playedBy?: string;
  /** caption: venue / event · city */
  place?: string;
  /** second caption line: the track */
  track?: string;
  /** original on Google Drive, not downloaded yet */
  drive?: string | null;
};

export type Photo = {
  id: string;
  kind: "live" | "studio" | "cutout";
  source: string;
  width: number;
  ratio: number;
  alt: string;
};

export type Section = { id: string; label: string; block: number; nav: boolean; built: boolean };

export type Release = { id: string; artists: string; title: string; label: string; url: string; embed: string };
export type Mix = {
  id: string;
  title: string;
  caption: string;
  listen: string;
  url: string;
  poster: string;
  posterAlt: string;
  ratio: number;
  bg: string;
};

// source (the original's file name) and drive stay in the manifest: file
// names never reach the page (client brief 22.10.2026).
export const videos = (videosJson.videos as Video[]).map(({ source: _source, drive: _drive, ...v }) => ({
  ...v,
  source: "",
  src: assetOrNull(v.src),
  preview: assetOrNull(v.preview),
  poster: assetOrNull(v.poster),
  crop: v.crop ? { preview: asset(v.crop.preview), poster: asset(v.crop.poster) } : undefined,
}));
export const photos = photosJson.photos as Photo[];
export const bio = bioJson;
export const sections = sectionsJson.sections as Section[];
export const releases = releasesJson.releases as Release[];
export const mixes = (radioJson.mixes as Mix[]).map((m) => ({ ...m, poster: asset(m.poster) }));
export const contacts = contactsJson;
export const finalPhotos = photosJson.final.map((id) => photos.find((p) => p.id === id)!);

/** AVIF + WebP srcset for a still built by scripts/brief-media.mjs (<base>-<w>.<ext>). */
export const stillSet = (base: string, widths: number[]) => ({
  avif: widths.map((w) => `${asset(base)}-${w}.avif ${w}w`).join(", "),
  webp: widths.map((w) => `${asset(base)}-${w}.webp ${w}w`).join(", "),
  src: `${asset(base)}-${widths[0]}.webp`,
});

export const video = (id: string) => {
  const v = videos.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown video ${id}`);
  return v;
};

export const photoSrc = (id: string, width = 640) => ({
  avif: `${BASE}/media/photo/${id}-${width}.avif`,
  webp: `${BASE}/media/photo/${id}-${width}.webp`,
});

/**
 * srcset for a photo. grey: the baked black-and-white variant (320 and 640
 * only). src is the fallback for the <img> itself.
 */
export const photoSet = (id: string, widths: number[] = [320, 640, 1280], grey = false) => {
  const name = (w: number, ext: string) => `${BASE}/media/photo/${id}${grey ? "-g" : ""}-${w}.${ext}`;
  return {
    avif: widths.map((w) => `${name(w, "avif")} ${w}w`).join(", "),
    webp: widths.map((w) => `${name(w, "webp")} ${w}w`).join(", "),
    src: name(widths[Math.min(1, widths.length - 1)], "webp"),
  };
};

export const isTodo = (value: string | null | undefined) => !value || value === TODO || value.startsWith("TODO_");

/** Nav from CLIENT-EDITS 1: Intro / Releases / Live / Played by / Bio; Booking sits apart as the primary action. */
export const NAV = ["intro", "releases", "live", "played-by", "bio"] as const;
