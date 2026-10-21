---
name: OPPAACHA
description: E-press-kit for the DJ OPPAACHA. A night club shot on an expensive camera, with a black stage, red light, and glass that refracts it.
colors:
  night: "#0a0a0a"
  surface: "#151515"
  surface-2: "#1e1d1c"
  line: "rgb(244 242 238 / 0.12)"
  ink: "#f4f2ee"
  muted: "#9a948d"
  signal-red: "#d8042c"
  hot-red: "#ff3b2f"
  inverse-paper: "#f4f2ee"
  inverse-ink: "#0a0a0a"
  inverse-muted: "#6b655f"
  glass-fill: "rgb(255 255 255 / 0.1)"
  glass-rim: "rgb(255 255 255 / 0.16)"
  primary-glass: "rgb(216 4 44 / 0.55)"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(44px, 7vw, 112px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.4vw, 64px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(22px, 2.2vw, 32px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  accent:
    fontFamily: "Parabola, Hanken Grotesk, sans-serif"
    fontWeight: 400
    letterSpacing: "0"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "NKDuy Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    letterSpacing: "0.14em"
    fontFeature: "tnum"
  numeral:
    fontFamily: "NKDuy Mono, ui-monospace, monospace"
    fontSize: "clamp(44px, 5.4vw, 80px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
rounded:
  sm: "12px"
  card: "28px"
  panel: "44px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 64px)"
  section-y: "clamp(96px, 14vw, 208px)"
  column-gap: "24px"
  control-gap: "12px"
  container: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.primary-glass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-clear:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  button-round:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "52px"
  nav-capsule:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
  nav-capsule-compact:
    rounded: "{rounded.pill}"
    height: "48px"
  chip-glass:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 14px"
  card-video:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  panel-glass:
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(28px, 3.4vw, 52px)"
  card-contact:
    backgroundColor: "{colors.inverse-paper}"
    textColor: "{colors.inverse-ink}"
    rounded: "{rounded.card}"
    padding: "clamp(24px, 3vw, 36px)"
  button-copy:
    backgroundColor: "{colors.inverse-ink}"
    textColor: "{colors.inverse-paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
---

# Design System: OPPAACHA

## Overview

**Creative North Star: "The Lit Stage"**

The page is a night club filmed on an expensive camera. The ground is black (night), red arrives as light rather than paint: radial glows, the grunge mark, one red glass button per view, and a hot red progress line. Liquid Glass capsules and panels sit over footage, photos or glow and bend them; on bare black they would be invisible, so they never appear there. Footage is the proof and type frames it: Hanken Grotesk 800 headlines tracked tight, one word per heading set in the brand face Parabola, small NKDuy Mono labels and numerals.

Loud and quiet blocks alternate. Loud blocks carry full media, red light or the giant OPPAACHA wordmark cropped by a section edge; quiet blocks are small type and air on the night ground or a faded surface. Light never ends in a seam: every glow, ambient blur, backdrop photo and underlay is masked to fade out before its section edge, so the page reads as one continuous dark room.

Motion is cinematic, not playful. Entrances use one expo-out curve, headline lines rise through masks with a 60ms stagger, photos are black and white and take colour on hover or when brought forward, and the glass "drop" springs between menu items. Controls do not chase the cursor.

This system was written from the shipped build. It implements the client's pinned DESIGN-SYSTEM.md v1 (Russian) and records, at the end, where the build departs from it.

**Key Characteristics:**
- One dark theme; warm-white paper appears only on the inverse booking card.
- Red is light: glow, mark, the primary glass, the progress line. Never a large flat fill outside the hero and booking close.
- Liquid Glass (21st.dev `apple-tahoe-liquid-glass-button`, mandated) for every control, chip, player panel and the rider panel, always over image or glow.
- Two-tone, stepped headlines with one Parabola word.
- Black-and-white photography that turns to colour on interaction.
- Seamless sections: masked light, no hard edges between blocks.

## Colors

A near-black stage, a warm white ink, and two reds that behave like stage light.

### Primary
- **Signal Red** (`signal-red`): the brand red of the mark. Glows (`--glow-a` at 55%), the Parabola accent word, the manifesto pill, the red tint on the primary glass, text selection, the arrows on the inverse card. Only bold type of 24px and up or graphics; it measures about 3.7:1 on night.
- **Primary Glass** (`primary-glass`): Signal Red at 55% under refracting glass. Frost fallback (Safari, Firefox) raises it to 62%; in the hero on phones it rises to 86% because the button sits over bright photo tiles.

### Secondary
- **Hot Red** (`hot-red`): red for small things and light. Section-label text, the glowing dot, the video progress fill, focus rings (2px, offset 3px), the secondary glow `--glow-b` at 28%.

### Neutral
- **Night** (`night`): page ground, html and body, theme colour. The hero panel sits one step lighter (#101010, local to the hero).
- **Surface** (`surface`): video stage and card ground before the poster paints, and the Support block's band, which fades in from and out to night.
- **Surface 2** (`surface-2`): photo tile and nested media ground; the reduced-transparency fallback for all glass.
- **Line** (`line`): 1px hairlines and the inset rim on media frames.
- **Ink** (`ink`): primary text, all glass button text. Secondary ink is the same colour at reduced alpha (0.72 nav links, 0.82 rider list text, 0.6 inactive sheet links).
- **Muted** (`muted`): the second half of two-tone headlines, leads, notes, captions.
- **Inverse Paper / Inverse Ink / Inverse Muted** (`inverse-paper`, `inverse-ink`, `inverse-muted`): the booking contact card only. Inverse Muted is for its mono labels.
- **Glass Fill / Glass Rim** (`glass-fill`, `glass-rim`): the frost fallback fill and the 1px inner rim of every glass element.

### Named Rules
**The Red Is Light Rule.** Red arrives as glow, mark, line or tinted glass. Outside the hero and the booking close it covers no more than about 8% of a screen, and small red text is always Hot Red, never Signal Red.

**The One Night Rule.** There is no light mode. Warm-white paper is the inverse contact card and nothing else.

## Typography

**Display Font:** Hanken Grotesk (variable, 400 to 800, via next/font; fallback system-ui, sans-serif)
**Accent Font:** Parabola (brand face, WOFF2 from the client's Identify folder)
**Label/Mono Font:** NKDuy Mono (brand face, 400 and 500)

**Character:** A heavy, tightly tracked grotesk carries the voice; the hand-cut Parabola word is the one flourish per heading, as in the client's rider PDF; the mono face makes labels, times and numbers feel like gear readouts.

### Hierarchy
- **Display** (800, clamp(44px, 7vw, 112px), line-height 0.92 to 0.95, -0.045em): every section headline (about, video, live, photo, rider, booking). Balanced wrapping.
- **Headline** (800, clamp(32px, 4.4vw, 64px), 1): the quieter Support headline.
- **Title** (700, clamp(22px, 2.2vw, 32px), 1.05, -0.03em): "now playing" in the showreel; card names step down to 17 to 19px at 600 to 700.
- **Accent** (Parabola 400, tracking 0, Signal Red, sometimes 1.04 to 1.12em): one word inside a display headline; rider panel titles in Parabola uppercase at clamp(32px, 3.4vw, 48px).
- **Body** (400, 16px, 1.55): running text, max about 62ch; hero tagline clamp(17px, 1.35vw, 20px) at 1.45, max 34ch; lists and notes at 15px.
- **Label** (NKDuy Mono 400, 11.5px, 0.14em, uppercase, tabular figures): captions, chip text, times, venue names, footer.
- **Numeral** (NKDuy Mono, clamp(44px, 5.4vw, 80px), 1, -0.03em, tabular): the manifesto figures, counted up on entry; suffix in Signal Red.

### Named Rules
**The One Parabola Word Rule.** Each headline gets at most one Parabola word, at 32px or larger. Parabola is never body or label text.

**The Two-Tone Line Rule.** Multi-line headlines split ink and muted: the statement in ink, the continuation in muted (or the reverse for the booking close, muted lead then the red Parabola word).

**The Stepped Line Rule.** Headline lines sit on a stepped grid: start lines indent 25%, others align centre or right. Below 768px the steps flatten to a left edge with a 12% indent.

## Layout

A 1440px container with fluid gutters (`gutter`) and a 12-column grid with 24px column gaps; blocks are separated by `section-y`. Below 1024px the 12 columns collapse to full-width stacks; below 768px to one column, with media rows turning into horizontal swipe strips (scroll-snap, hidden scrollbars, gutter bleed).

Asymmetry is the default. Hero copy spans columns 1 to 7 with the clip in 9 to 12; the showreel stage spans 4 to 8 with the side column at 9 to 11, level with the stage top; rider intro 1 to 4 (sticky at 120px) against tabs 6 to 12; photos split 7 / 5 between grid and cut-out figure. The booking close is the only centred composition.

Full media bleeds past the grid (hero ribbon, live track, photo ring); text and controls hold the grid. Live pins for one viewport height and travels sideways on desktop, a swipe strip on phones and under reduced motion.

**The Even Row Rule.** Media cards in a row share one height: the live track, the support row (4:5) and the photo ring are level. Stepping (0 / 48 / 0 / 96) survives only on the manifesto numbers.

**The No Seam Rule.** Every glow, ambient blur, backdrop photo and underlay fades to transparent before its section edge (mask gradients, or a background that resolves to night at both ends). No block shows a hard horizontal edge against the next.

## Elevation & Depth

Depth comes from light and glass, never from drop shadows. Surfaces are flat; what lifts an element is the glass refracting what is behind it plus two inset lines, a 1px top highlight and a 1px bottom lowlight, and a 1px inset rim. The page itself is layered: photo ribbon, red light, a blend-mode tint that reddens the grey photos, a fixed film grain at 7% opacity over everything.

### Shadow Vocabulary
- **Glass highlight** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.35)`): top edge of every glass element.
- **Glass lowlight** (`box-shadow: inset 0 -1px 0 rgb(0 0 0 / 0.3)`): bottom edge of buttons, panels, nav capsule.
- **Glass rim** (`box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.16)`): outline of glass; the active drop uses a 0.1 rim.
- **Media rim** (`box-shadow: inset 0 0 0 1px rgb(244 242 238 / 0.12)`): edge of video and photo frames.
- **Signal glow** (`box-shadow: 0 0 6px 1px rgb(255 59 47 / 0.75), 0 0 18px 4px rgb(216 4 44 / 0.45)`): the one outer shadow, and it is light, not elevation.

### Named Rules
**The Glass Over Light Rule.** Glass appears only over an image, video or glow. On bare night use a surface fill instead.

**The No Drop Shadow Rule.** No element casts a shadow to look raised. Outer shadows exist only as emitted light.

## Shapes

Rounded, with radius scaled to the object: 12px for small photo tiles and the inverse card's contact rows, 28px for video cards, photo cards and the contact card, 44px for large panels (the showreel stage, the rider panel, the mobile menu sheet, and the hero's lower corners, which crop the giant wordmark), 999px for every control, chip, capsule, switch and progress rail. Large panels drop to 28px on phones. Media inside a padded glass frame takes the frame radius minus its padding (22px inside the 6px hero clip frame). Portrait video is 9:16, support frames 4:5, studio portraits 2:3.

The giant OPPAACHA wordmark is a recurring silhouette: full width (104%), cropped by a section's lower edge, at low opacity (hero 11%, photos 10% and masked, booking 14%).

## Components

### Buttons
Liquid Glass anchors, ink text at 600, tracking -0.01em, 18px stroke icons at 1.75.
- **Shape:** full capsule (999px), 52px tall, 26px side padding, 15px text, 10px icon gap.
- **Primary:** red-toned glass (Signal Red tint, 55%). One per view: Booking in the hero and nav, Write to booking, Download rider.
- **Clear:** untinted regular glass with the frost fill. Watch showreel, Instagram @handle, Rider (PDF).
- **Round:** 52px glass circle for carousel arrows and the mobile menu trigger.
- **Hover / Focus:** colour shift only (200ms, expo-out); the glass reacts to the pointer itself. Focus is a 2px Hot Red outline offset 3px. Buttons never move toward the cursor.
- **Nav variant:** 42px tall, 20px padding, 14px text; 36px when the nav compacts.
- **Copy (inverse card):** solid inverse-ink pill, 40px, presses to 0.97.

### Chips
- **Style:** glass capsule, mono label text in ink, 9px by 14px, dark frost fill (rgb 16 16 16 / 0.42), truncates with an ellipsis.
- **Use:** venue on live cards, "played by" and the stage chip over the player.

### Cards / Containers
- **Video card:** 28px corners on Surface with the media rim; poster image, a muted preview video fades in (600ms) when in view; hover lifts 4 to 6px or scales the image to 1.03 and restores colour. Caption below in label and title type.
- **Glass panel (rider):** 44px corners (28px on phones), regular glass with a dark frost fill, clamp(28px, 3.4vw, 52px) padding, Parabola uppercase title, two-column groups, group labels in ink at 92% (not red; red mono measured 2.75:1 on the glass).
- **Contact card:** the only light surface. Inverse paper, 28px corners, email at clamp(22px, 2.6vw, 30px) 700, contact rows on 6% ink tint at 12px corners.

### Navigation
- **Desktop:** a floating glass capsule top centre, 56px (48px once scrolled), the round mark at left, links at 14px 500 in ink at 72%, current link at full ink, a glass drop that springs between links (spring stiffness 380, damping 32), and the primary Booking button at its right end.
- **Mobile:** collapses to a round glass mark and trigger; opens a full glass sheet (44px corners) with display-size links (clamp(44px, 13vw, 64px)) at 60% ink, current at full ink, and a full-width primary Booking.
- **Entrance:** drops in from above with a spring overshoot, `cubic-bezier(0.34, 1.45, 0.5, 1)` over 0.9s. This is the only bounce in the system, pinned by the client and recorded in `.impeccable/config.json`.

### Video Stage and Player (signature)
A 9:16 stage at 44px corners (shared by the showreel and the clip lightbox). The control bar is a glass capsule 60px tall inset 12px from the stage edges: 44px round buttons, a 3px rail at 20% ink with a Hot Red fill on a 28px hit row, a mono time readout. Sound plays on click. A glass chip follows the pointer over the stage.

### Glow Pill (signature)
A capsule (2em by 0.74em) set into a headline line, holding a looping clip under a Signal Red hard-light wash and a light band. Used once, in the manifesto.

### Photo Treatment (signature)
Every photograph is greyscale with a slight contrast lift and dimming; it takes full colour on hover, focus, or when it is the front card of the ring. The cut-out figure stands in front of the giant wordmark and fades into the floor.

## Do's and Don'ts

### Do:
- **Do** keep the page on Night and let red arrive as light; use Hot Red for any red text under 24px.
- **Do** put glass only over footage, photos or glow, with the highlight, lowlight and rim insets.
- **Do** keep one primary red glass button per view; everything else is clear glass.
- **Do** set headlines in Hanken Grotesk 800 at -0.045em, two-tone, stepped, with at most one Parabola word.
- **Do** mask every glow, ambient blur, backdrop and underlay so it fades before the section edge.
- **Do** keep media cards in a row at one height.
- **Do** show photographs in black and white and give colour on interaction.
- **Do** animate only transform, opacity and filter, entrances on `cubic-bezier(0.2, 0.9, 0.3, 1)` and state changes on `cubic-bezier(0.7, 0, 0.2, 1)`, and honour reduced motion and reduced transparency.
- **Do** leave out any field whose content is unknown; the data keeps `TODO_FROM_PROMOKIT`, the page shows nothing.

### Don't:
- **Don't** add a light theme, beige or cream grounds, or purple-blue gradients.
- **Don't** use drop shadows for elevation.
- **Don't** let a section end in a hard seam or a glow cut off by an edge.
- **Don't** step video cards vertically in a row.
- **Don't** make buttons magnetise toward the cursor.
- **Don't** add bounce or overshoot easing beyond the nav drop.
- **Don't** render visible placeholders, dashed slots or "coming soon" copy.
- **Don't** add a tour or dates block.

## Divergences from DESIGN-SYSTEM.md

What shipped differs from the client's pinned system in these places:
- **Tour block (DS 6, block 7):** removed by the client; no dates anywhere.
- **Magnetic buttons (DS 8.8):** cancelled by the client.
- **Stepped cards (DS 4):** video rows are level by client decision; stepping remains only on the manifesto numbers.
- **Seams:** the client added the no-hard-transition rule; all light is masked before section edges.
- **Placeholders:** the client ruled out visible placeholders; unknown fields are omitted.
- **Instagram:** @oppaacha has its own clear glass button in Booking, beside Write to booking and Rider (PDF).
- **Primary glass strength (DS 7.4, 55 to 70%):** 55% refracting, 62% frost; 86% in the hero on phones, above the pinned range, for legibility over bright tiles.
- **Rider group labels:** ink, not red, for contrast on glass.
- **Menu drop spring (DS 8.2):** the overshoot curve is a deliberate exception.
- **Display XL (DS 3):** the `clamp(56px, 11vw, 176px)` step is defined but no text uses it; the hero mark and the giant wordmark are images.

**Open deviation, not settled:** section labels (`/about`, `/video`, `/live`, `/support`, `/photo`, `/rider`, `/booking` in Hot Red mono with a glowing dot) ship because DS 9 pins them, but the finish review flags them against the craft floor as kickers. They await the client's explicit keep or remove. Until then they are not a system rule: new surfaces must not add more of them.
