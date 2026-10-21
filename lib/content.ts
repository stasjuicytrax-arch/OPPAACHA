import videosJson from "@/content/videos.json";
import photosJson from "@/content/photos.json";
import bioJson from "@/content/bio.json";
import sectionsJson from "@/content/sections.json";

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
  duration: number;
  hasAudio: boolean;
  /** landscape slice of a vertical clip, same shape as preview/poster */
  crop?: { preview: string; poster: string };
  /** width / height of the picture; 9/16 when absent */
  aspect?: number;
  /** Support: who plays the track, and where */
  playedBy?: string;
  place?: string;
};

export type Photo = {
  id: string;
  kind: "live" | "studio" | "cutout";
  source: string;
  width: number;
  ratio: number;
  alt: string;
};

export type Section = { id: string; label: string; block: number; built: boolean };

export const videos = (videosJson.videos as Video[]).map((v) => ({
  ...v,
  src: assetOrNull(v.src),
  preview: assetOrNull(v.preview),
  poster: assetOrNull(v.poster),
  crop: v.crop ? { preview: asset(v.crop.preview), poster: asset(v.crop.poster) } : undefined,
}));
export const photos = photosJson.photos as Photo[];
export const bio = bioJson;
export const sections = sectionsJson.sections as Section[];

export const video = (id: string) => {
  const v = videos.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown video ${id}`);
  return v;
};

export const photoSrc = (id: string, width = 640) => ({
  avif: `${BASE}/media/photo/${id}-${width}.avif`,
  webp: `${BASE}/media/photo/${id}-${width}.webp`,
});

export const isTodo = (value: string | null | undefined) => !value || value === TODO;

/** Nav order from TECH-SPEC 5.0; Booking sits apart as the primary action. */
export const NAV = ["intro", "video", "live", "support", "rider"] as const;
