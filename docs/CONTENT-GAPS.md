# Content gaps

Checked 21.10.2026. There is no OPPAACHA PromoKit in the project folder, in "Все что нужно тут" or anywhere on the Desktop. The only press kits on disk belong to other artists (39 KINGDOM, DJ LOLLY, DJSUNRISE) and must not be used. Rider.pdf is three image pages with no text layer and no links: technical, hospitality, payment. It mentions "OPPAACHA's management" without any contact details.

Everything below stays `TODO_FROM_PROMOKIT` until the client sends it. A release build (`RELEASE=1 npm run build`) fails while any marker is left.

| What | File | Where it shows |
|---|---|---|
| Tagline (one line under the logo) | `content/bio.json` → `tagline` | Hero |
| Bio (one or two paragraphs) | `content/bio.json` → `bio` | Manifesto block / booking |
| Manifesto (2-4 short lines) | `content/bio.json` → `manifesto.lines` | Block 2 |
| Numbers (3-4: years, gigs, countries, streams...) | `content/bio.json` → `stats` | Block 2 |
| Tour dates: date, city, country, venue, status, ticket link | `content/tour.json` → `dates` | Block 7 |
| Booking: manager or agency name, email, phone | `content/contacts.json` → `booking` | Block 9 |
| Socials: Instagram, SoundCloud, Spotify, Beatport, Resident Advisor... | `content/contacts.json` → `socials` | Block 9 |
| V02 venue and V12 track title | `content/videos.json` | Showreel, Support |

Confirmed by the client and already on the page: V01 and V09 are Solomun playing "Umbrella" (Tomorrowland Main Stage, Zürich), V10 Adriatique playing "My Soul", V11 CamelPhat playing "Don't Stop", V12 a Solomun play. V08 venue (Flava, Moscow) is read from the screens in the footage.
