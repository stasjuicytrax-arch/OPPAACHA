import type { CSSProperties } from "react";
import { ArrowUpRight, FileText, Images, Mail } from "lucide-react";
import { siBeatport, siInstagram, siSoundcloud, siSpotify, siTelegram, siWhatsapp, type SimpleIcon } from "simple-icons";
import contacts from "@/content/contacts.json";
import { CopyEmail } from "@/components/copy-email";
import { GlassLink } from "@/components/glass";
import { InView } from "@/components/in-view";
import { asset, bio, finalPhotos, photoSet } from "@/lib/content";

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
 * The closing block (client brief 22.10.2026, block 10): two photos, the
 * inverse contact card, then Press photos & logos · Download rider ·
 * Booking, and the socials. Red light, the giant OPPAACHA underneath.
 * Contacts as before (PromoKit); the rider is the PDF only.
 */
export function Booking() {
  const { booking, socials } = contacts;
  const subject = encodeURIComponent("Booking request: OPPAACHA");
  const wa = `https://wa.me/${booking.whatsapp.replace(/\D/g, "")}`;
  const tg = `https://t.me/${booking.telegram.replace(/^@/, "")}`;

  return (
    <section id="booking" aria-labelledby="booking-title" className="bk">
      <div className="shell bk-inner">
        <InView as="ul" stagger className="bk-photos">
          {finalPhotos.map((p, i) => {
            const set = photoSet(p.id, [640, 1280]);
            return (
              <li key={p.id} className="bk-photo" data-asset-id={p.id} style={{ "--i": i } as CSSProperties}>
                <picture>
                  <source type="image/avif" srcSet={set.avif} sizes="(max-width: 767px) 46vw, 30vw" />
                  <img src={set.src} srcSet={set.webp} sizes="(max-width: 767px) 46vw, 30vw" alt={p.alt} width={640} height={Math.round(640 / p.ratio)} loading="lazy" decoding="async" />
                </picture>
              </li>
            );
          })}
        </InView>

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

        <InView as="div" stagger className="bk-actions">
          <GlassLink href={contacts.media.pressFolder} tone="clear" target="_blank" rel="noopener noreferrer" aria-label="Press photos and logos on Google Drive (opens in a new tab)">
            <Images aria-hidden />
            Press photos &amp; logos
          </GlassLink>
          <GlassLink href={asset(contacts.media.rider)} tone="clear" download>
            <FileText aria-hidden />
            Download rider
          </GlassLink>
          <GlassLink href={`mailto:${booking.email}?subject=${subject}`} tone="primary">
            <Mail aria-hidden />
            Booking
          </GlassLink>
        </InView>

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
        </ul>

        <footer className="bk-footer">
          <span className="label text-muted">{bio.tagline}</span>
        </footer>
      </div>

      <img src={asset("/media/brand/oppaacha-wordmark-flat.webp")} srcSet={`${asset("/media/brand/oppaacha-wordmark-flat-1200.webp")} 1200w, ${asset("/media/brand/oppaacha-wordmark-flat.webp")} 2400w`} sizes="104vw" loading="lazy" decoding="async" alt="" aria-hidden width={2400} height={363} className="bk-underlay" />
    </section>
  );
}
