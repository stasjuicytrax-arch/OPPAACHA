import type { CSSProperties } from "react";
import { Download } from "lucide-react";
import riderJson from "@/content/rider.json";
import { GlassLink } from "@/components/glass";
import { InView } from "@/components/in-view";
import { RiderTabs, type RiderTab } from "@/components/rider-tabs";
import { asset, photoSrc } from "@/lib/content";

/**
 * Block 8 (TECH-SPEC 5.8), a quiet block: the rider as readable text in a
 * glass panel, three tabs, and the PDF to download. The sea-wall photo from
 * the rider's own cover sits behind the glass so it has light to bend.
 */
export function Rider() {
  const tabs = riderJson.tabs as RiderTab[];
  const backdrop = photoSrc("P03", 1280);

  return (
    <section id="rider" aria-labelledby="rider-title" className="rd">
      <div className="rd-backdrop" aria-hidden style={{ "--rd-photo": `url(${backdrop.webp})` } as CSSProperties} />

      <div className="shell rd-grid">
        <div className="rd-intro">
          <p className="label m-label">
            <span className="m-dot" aria-hidden />/rider
          </p>
          <InView as="h2" className="rd-title display">
            <span id="rider-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
              <span className="m-line-inner">Rider</span>
            </span>
          </InView>
          <p className="rd-lead">Technical, hospitality and payment terms.</p>
          <GlassLink href={asset(riderJson.pdf)} tone="primary" download className="rd-download">
            <Download aria-hidden />
            Download rider (PDF)
          </GlassLink>
          <p className="label text-muted rd-size">3 pages, 0.9 MB</p>
        </div>

        <RiderTabs tabs={tabs} />
      </div>
    </section>
  );
}
