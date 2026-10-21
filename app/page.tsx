import { Hero } from "@/components/hero";
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
        {/* Blocks still in progress keep their anchors so the menu works
            while the page is assembled (TECH-SPEC section 8). */}
        {sections
          .filter((s) => !s.built)
          .map((s) => (
            <section key={s.id} id={s.id} aria-label={s.label} className="pending-block shell">
              <p className="label text-accent-hot">/{s.id}</p>
              <h2 className="display pending-title">
                {s.label}
                <span className="text-muted"> lands in block {s.block}</span>
              </h2>
            </section>
          ))}
      </main>
    </>
  );
}
