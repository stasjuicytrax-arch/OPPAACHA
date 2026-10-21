# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS 4, static export (`output: 'export'`). Motion, GSAP + ScrollTrigger, Lenis. Pinned by the client in TECH-SPEC.md section 3.

## Users

Booking agencies and promoters who receive the press kit as a link instead of a PDF. They review many artists, decide fast and are visually demanding: within five seconds the page must read as a top-tier act with a top-tier presentation.

## Product Purpose

An e-press-kit for the DJ OPPAACHA. It replaces the old PhotoShop-to-PDF PromoKit. Success is two actions: the visitor watches the video, and the visitor writes to booking.

## Positioning

The artist's own footage and stages (Tomorrowland Main Stage, Savaya Bali, Umbrella Zürich, Trip Main Stage) and support plays by Adriatique, CamelPhat and Solomun, presented as a site rather than a PDF.

## Operating Context

Sent by the management as a link in email and messengers; opened on laptops and phones, often between other offers. The rider must read as text and download as a PDF.

## Capabilities and Constraints

- One page, anchors `#intro #video #live #support #photo #tour #rider #booking`.
- All 12 videos, all 13 photos and every tour date must render; `scripts/verify-coverage.mjs` enforces it and writes COVERAGE.md.
- Original media never enters git (`source-media/`, client folder ignored); derivatives in `public/media`.
- Lighthouse mobile performance ≥ 85, accessibility ≥ 95; widths 360 / 768 / 1280 / 1920 with no horizontal scroll; `prefers-reduced-motion` honoured.
- Language: English, like the rider.

## Brand Commitments

- Name: OPPAACHA. Logos in `Все что нужно тут/Identify` (main, additional, grunge). Hero uses the grunge colored mark.
- Visual system pinned by the client in DESIGN-SYSTEM.md: palette Signal Red / Night, Liquid Glass across navigation and controls, Hanken Grotesk + brand fonts Parabola and NKDuy Mono.
- Liquid Glass comes from the 21st.dev component `apple-tahoe-liquid-glass-button` (mandatory).

## Evidence on Hand

- Video: 12 files (inventory in TECH-SPEC.md 2.2, manifest `content/videos.json`).
- Photo: 5 live, 8 studio including one cut-out (`content/photos.json`).
- Rider.pdf: technical, hospitality, payment (transcribed in TECH-SPEC.md 5.8).
- Absent and never to be invented: tour dates (B1), booking contacts and socials (B2), bio, tagline and numbers (B3). They render as `TODO_FROM_PROMOKIT` until the PromoKit arrives.

## Product Principles

1. Footage first: the artist on real stages is the proof; type and glass frame it, never replace it.
2. Two exits only: watch, or book. Every block leads to one of them.
3. Nothing invented: dates, numbers and quotes come from the PromoKit or stay marked.
4. Fast on a phone in a taxi: posters before video, video only in view.

## Accessibility & Inclusion

WCAG AA contrast (small red text uses `--accent-hot`), visible focus (2px `--accent-hot`, offset 3px), reduced-motion fallbacks, video muted by default with sound on request.
