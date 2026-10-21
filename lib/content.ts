import videosJson from "@/content/videos.json";
import photosJson from "@/content/photos.json";
import bioJson from "@/content/bio.json";
import sectionsJson from "@/content/sections.json";

export const TODO = "TODO_FROM_PROMOKIT";

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

export const videos = videosJson.videos as Video[];
export const photos = photosJson.photos as Photo[];
export const bio = bioJson;
export const sections = sectionsJson.sections as Section[];

export const video = (id: string) => {
  const v = videos.find((x) => x.id === id);
  if (!v) throw new Error(`Unknown video ${id}`);
  return v;
};

export const photoSrc = (id: string, width = 640) => ({
  avif: `/media/photo/${id}-${width}.avif`,
  webp: `/media/photo/${id}-${width}.webp`,
});

export const isTodo = (value: string | null | undefined) => !value || value === TODO;

/** Nav order from TECH-SPEC 5.0; Booking sits apart as the primary action. */
export const NAV = ["intro", "video", "live", "support", "tour", "rider"] as const;
