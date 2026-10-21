import type { CSSProperties } from "react";
import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { siBeatport, siInstagram, siSoundcloud, siSpotify, siTelegram, siWhatsapp, type SimpleIcon } from "simple-icons";
import contacts from "@/content/contacts.json";
import riderJson from "@/content/rider.json";
import { CopyEmail } from "@/components/copy-email";
import { GlassLink } from "@/components/glass";
import { InView } from "@/components/in-view";
import { asset, bio } from "@/lib/content";

const ICONS: Record<string, SimpleIcon> = {
  Spotify: siSpotify,
  Instagram: siInstagram,
  Beatport: siBeatport,
  SoundCloud: siSoundcloud,
};

function Brand({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="bk-brand">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

/**
 * Block 9 (TECH-SPEC 5.9), the loud close: red light, the giant OPPAACHA
 * underneath, the inverse contact card in the middle, then the one action,
 * Write to booking, and the socials. All contacts from the PromoKit.
 */
export function Booking() {
  const { booking, socials } = contacts;
  const subject = encodeURIComponent("Booking request: OPPAACHA");
  const wa = `https://wa.me/${booking.whatsapp.replace(/\D/g, "")}`;
  const tg = `https://t.me/${booking.telegram.replace(/^@/, "")}`;

  return (
    <section id="booking" aria-labelledby="booking-title" className="bk">
      <div className="shell bk-inner">
        <p className="label m-label">
          <span className="m-dot" aria-hidden />/booking
        </p>
        <InView as="h2" className="bk-title display">
          <span id="booking-title" className="m-line" style={{ "--i": 0 } as CSSProperties}>
            <span className="m-line-inner text-muted">See u on the</span>
          </span>
          <span className="m-line" style={{ "--i": 1 } as CSSProperties}>
            <span className="m-line-inner m-accent">dancefloor</span>
          </span>
        </InView>

        <article className="bk-card" aria-label="Booking contact">
          <div className="bk-card-head">
            <span className="label">Booking</span>
            <span className="bk-manager">{booking.manager}</span>
          </div>
          <CopyEmail email={booking.email} />
          <ul className="bk-direct">
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <Brand icon={siWhatsapp} />
                <span>
                  <span className="label bk-direct-kind">WhatsApp</span>
                  {booking.whatsapp}
                </span>
                <ArrowUpRight aria-hidden className="bk-arrow" />
              </a>
            </li>
            <li>
              <a href={tg} target="_blank" rel="noopener noreferrer">
                <Brand icon={siTelegram} />
                <span>
                  <span className="label bk-direct-kind">Telegram</span>
                  {booking.telegram}
                </span>
                <ArrowUpRight aria-hidden className="bk-arrow" />
              </a>
            </li>
          </ul>
        </article>

        <div className="bk-actions">
          <GlassLink href={`mailto:${booking.email}?subject=${subject}`} tone="primary">
            <Mail aria-hidden />
            Write to booking
          </GlassLink>
          <GlassLink href={asset(riderJson.pdf)} tone="clear" download>
            <FileText aria-hidden />
            Rider (PDF)
          </GlassLink>
        </div>

        <ul className="bk-socials" aria-label="OPPAACHA online">
          {socials.map((s) => {
            const icon = ICONS[s.network];
            return (
              <li key={s.network}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="bk-social" aria-label={`${s.network} (opens in a new tab)`}>
                  {icon ? <Brand icon={icon} /> : null}
                  <span>{s.network}</span>
                </a>
              </li>
            );
          })}
          <li>
            <a href={contacts.media.pressFolder} target="_blank" rel="noopener noreferrer" className="bk-social" aria-label="Press photos and media on Google Drive (opens in a new tab)">
              <ArrowUpRight aria-hidden className="bk-brand" />
              <span>Press folder</span>
            </a>
          </li>
        </ul>

        <footer className="bk-footer">
          <span className="label">OPPAACHA</span>
          <span className="label text-muted">{bio.tagline}</span>
        </footer>
      </div>

      <img src={asset("/media/brand/oppaacha-wordmark-ink.webp")} alt="" aria-hidden width={2400} height={519} className="bk-underlay" />
    </section>
  );
}
