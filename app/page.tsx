import { Hero } from "@/components/hero";
import { Releases } from "@/components/releases";
import { Collab } from "@/components/collab";
import { Bio } from "@/components/bio";
import { LabelBlock } from "@/components/label-block";
import { Radio } from "@/components/radio";
import { Live } from "@/components/live";
import { Marquee } from "@/components/marquee";
import { PlayedBy } from "@/components/played-by-section";
import { Booking } from "@/components/booking";
import { SiteNav } from "@/components/site-nav";
import { NAV, bio, mixes, releases, sections } from "@/lib/content";

const navItems = NAV.map((id) => {
  const s = sections.find((x) => x.id === id)!;
  return { id: s.id, label: s.label };
});

// Block order from the client brief of 22.10.2026 (CLIENT-EDITS-2026-10-22.md 1).
export default function Page() {
  return (
    <>
      <SiteNav items={navItems} />
      <main>
        <Hero />
        <Releases releases={releases} />
        <Collab />
        <Bio />
        <LabelBlock />
        <Radio mixes={mixes} />
        <Live />
        <Marquee groups={bio.marquee} />
        <PlayedBy />
        <Booking />
      </main>
    </>
  );
}
