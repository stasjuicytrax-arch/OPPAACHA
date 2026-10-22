#!/usr/bin/env node
// Coverage gate (CLIENT-EDITS-2026-10-22.md section 5). Reads the exported
// HTML in out/ and fails when an item of the client brief is not on the page,
// or when something the client removed is back.
//
//   npm run build            # runs this as postbuild
//   npm run verify           # standalone, on an existing out/
//   RELEASE=1 npm run build  # production gate: no pending items, no TODO_*
//
// A check whose block is not built yet (content/sections.json, built:false),
// or whose media is still on drive (src null), is reported as pending instead
// of failing, so the gate stays green while the page is assembled.
// RELEASE=1 removes that allowance.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const RELEASE = process.env.RELEASE === "1";

const read = (p) => JSON.parse(readFileSync(path.join(ROOT, p), "utf8"));
const html = (() => {
  const file = path.join(ROOT, "out", "index.html");
  if (!existsSync(file)) {
    console.error("verify-coverage: out/index.html not found. Run `npm run build` first.");
    process.exit(1);
  }
  return readFileSync(file, "utf8");
})();

const { videos } = read("content/videos.json");
const { releases } = read("content/releases.json");
const { mixes } = read("content/radio.json");
const bio = read("content/bio.json");
const { sections } = read("content/sections.json");
const built = new Set(sections.filter((s) => s.built).map((s) => s.id));

/** The markup of <section id="id"> (sections are never nested). */
const section = (id) => {
  const start = html.search(new RegExp(`<section[^>]*\\bid="${id}"`));
  if (start < 0) return "";
  const end = html.indexOf("</section>", start);
  return html.slice(start, end < 0 ? undefined : end);
};
const count = (text, re) => (text.match(re) ?? []).length;
const has = (text, id) => text.includes(`data-asset-id="${id}"`);
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const rows = [];
/** One manifest line. ok: true / false; pend: why a failure is only pending. */
function check(n, label, sectionId, ok, detail = "", pend = "") {
  let state = ok ? "ok" : "fail";
  if (!ok && !RELEASE && (!built.has(sectionId) || pend)) state = "pending";
  rows.push({ n, label, state, detail: ok ? "" : detail || (built.has(sectionId) ? "" : `block ${sectionId} not built`) || pend });
}

// 1. Five releases: cover, title, label, Spotify link.
{
  const s = decode(section("releases"));
  const missing = releases.filter(
    (r) => !(has(s, r.id) && s.includes(r.title) && s.includes(r.label) && s.includes(`href="${r.url}"`)),
  );
  check(1, "5 releases: cover, title, label, Spotify link", "releases", releases.length === 5 && !missing.length, missing.map((r) => r.id).join(", "));
}

// 2. Collaboration: CamelPhat video, caption with "Upcoming".
{
  const s = section("collab");
  const v = videos.find((x) => x.id === bio.collab.video);
  const ok = has(s, v.id) && /Upcoming/.test(s) && s.includes("CamelPhat") && !!v.src;
  check(2, "Collaboration: CamelPhat video, caption says Upcoming", "collab", ok, "", v.src ? "" : `${v.id} still on drive (poster only)`);
}

// 3. Highlights: Music 8, Touring 4, no Diynamic Top 10 in Music.
{
  const s = section("bio");
  const list = (kind) => {
    const m = s.match(new RegExp(`<ul[^>]*data-highlights="${kind}"[^>]*>([\\s\\S]*?)</ul>`));
    return m ? m[1] : "";
  };
  const music = list("music");
  const touring = list("touring");
  const ok = count(music, /<li\b/g) === 8 && count(touring, /<li\b/g) === 4 && !/Top 10/i.test(music);
  check(3, "Highlights: Music 8, Touring 4, no Top 10 in Music", "bio", ok, `music ${count(music, /<li\b/g)}, touring ${count(touring, /<li\b/g)}`);
}

// 4. Diynamic charts by the Top 10 paragraph; tour poster by the Australia item.
{
  const s = section("bio");
  const para = s.search(/Top 10 artists/);
  const charts = s.search(/data-charts-for="top10"/);
  const chartsOk = para >= 0 && charts >= 0 && bio.charts.items.every((c) => has(s.slice(charts, charts + 4000), c.id));
  const aus = s.indexOf("Debut Australian tour");
  const li = aus >= 0 ? s.slice(aus, s.indexOf("</li>", aus)) : "";
  const posterOk = has(li, "T01");
  check(4, "Diynamic charts at the Top 10 paragraph, tour poster at Australia", "bio", chartsOk && posterOk, `charts ${chartsOk ? "ok" : "missing"}, poster ${posterOk ? "ok" : "missing"}`);
}

// 5. Radio: two 3:4 cards, each with a player and a poster.
{
  const s = section("radio");
  const missing = mixes.filter((m) => {
    const at = s.indexOf(`data-mix="${m.id}"`);
    if (at < 0) return true;
    const card = s.slice(at, at + 4000);
    return !(has(card, m.id) && /data-player="soundcloud"/.test(card) && /data-ratio="3:4"/.test(card));
  });
  check(5, "Radio: 2 cards 3:4, player and poster each", "radio", mixes.length === 2 && !missing.length, missing.map((m) => m.id).join(", "));
}

// 6. Live: the kept clips and the new Batur / TRIP picks; no V06, no working titles.
{
  const s = section("live");
  const live = videos.filter((v) => v.section === "live");
  const ready = live.filter((v) => v.src);
  const waiting = live.filter((v) => !v.src);
  const missing = ready.filter((v) => !has(s, v.id));
  const banned = ["Flava Back", "Los Goodman", "Gioli"].filter((w) => html.includes(w));
  const gone = has(html, "V06") || videos.some((v) => v.id === "V06");
  const ok = !missing.length && !banned.length && !gone && ["V04", "V05", "V07", "V08"].every((id) => has(s, id));
  check(6, "Live: V04, V05, V07, V08 on stage; no V06, Flava Back, Los Goodman, Gioli", "live", ok, [...missing.map((v) => v.id), ...banned, gone ? "V06" : ""].filter(Boolean).join(", "));
  check(6, "Live: new Batur / TRIP clips", "live", !waiting.length, "", waiting.length ? `on drive: ${waiting.map((v) => v.id).join(", ")}` : "");
}

// 7. Played by: six cards, CamelPhat links to the collaboration (no second player).
{
  const s = section("played-by");
  const cards = count(s, /data-played-by="/g);
  const at = s.indexOf('data-played-by="CamelPhat"');
  const camel = at >= 0 ? s.slice(at, s.indexOf("</li>", at)) : "";
  const ok = cards === 6 && camel.includes('href="#collab"') && !/<video|<iframe/.test(camel);
  check(7, "Played by: 6 cards, CamelPhat links to the collaboration", "played-by", ok, `${cards} cards`);
}

// 8. No TODO_* markers in the shipped HTML.
const todos = [...new Set(html.match(/TODO_[A-Z0-9_]+/g) ?? [])];
check(8, "No TODO_* markers", "booking", !todos.length, "", todos.length ? todos.join(", ") : "");

const errors = rows.filter((r) => r.state === "fail");
const pending = rows.filter((r) => r.state === "pending");
const status = errors.length ? "FAIL" : pending.length ? "PASS (with pending items)" : "PASS";
const mark = { ok: "yes", fail: "**no**", pending: "pending" };

// 9. The report.
const report = `# Coverage

Generated by \`scripts/verify-coverage.mjs\` on every build${RELEASE ? " (release mode)" : ""}, against the manifest in CLIENT-EDITS-2026-10-22.md section 5. No timestamp, so the file only changes when coverage does.

**${status}**

| # | Check | On page | Note |
|---|---|---|---|
${rows.map((r) => `| ${r.n} | ${r.label} | ${mark[r.state]} | ${r.detail} |`).join("\n")}
`;
writeFileSync(path.join(ROOT, "COVERAGE.md"), report);

for (const r of pending) console.warn(`verify-coverage: pending: ${r.label}${r.detail ? ` (${r.detail})` : ""}`);
if (errors.length) {
  for (const r of errors) console.error(`verify-coverage: FAIL: ${r.label}${r.detail ? ` (${r.detail})` : ""}`);
  process.exit(1);
}
console.log(`verify-coverage: ${status}`);
