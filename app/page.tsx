import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Showreel } from "@/components/showreel";
import { Live } from "@/components/live";
import { Support } from "@/components/support";
import { Photos } from "@/components/photos";
import { Rider } from "@/components/rider";
import { Booking } from "@/components/booking";
import { SiteNav } from "@/components/site-nav";
import { NAV, sections } from "@/lib/content";

const navItems = NAV.map((id) => {
  const s = sections.find((x) => x.id === id)!;
  return { id: s.id, label: s.label };
});

export default function Page() {
  return (
    <>
      <SiteNav items={navItems} />
      <main>
        <Hero />
        <Manifesto />
        <Showreel />
        <Live />
        <Support />
        <Photos />
        <Rider />
        <Booking />
      </main>
    </>
  );
}
