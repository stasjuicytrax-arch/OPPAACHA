import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/smooth-scroll";
import { asset } from "@/lib/content";
import "./globals.css";
import "./hero.css";
import "./manifesto.css";
import "./showreel.css";
import "./live.css";
import "./support.css";
import "./photos.css";
import "./rider.css";
import "./booking.css";

// Runs before paint. data-lite marks phones, coarse pointers, weak hardware
// (<= 4 cores or <= 4 GB) and reduced motion: those get static glass, no
// autoplay and no preloader (components/glass.tsx, performance 22.10.2026).
// Elsewhere the preloader plays once per session and the hero intro waits
// for it only on that first visit.
const introScript = `try{var d=document.documentElement,n=navigator;d.dataset.js="";var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;var lite=rm||matchMedia("(max-width: 768px), (pointer: coarse)").matches||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||(n.deviceMemory&&n.deviceMemory<=4);if(lite)d.dataset.lite="";if(lite||sessionStorage.getItem("opp-intro")){d.dataset.introSeen=""}else{sessionStorage.setItem("opp-intro","1");d.style.setProperty("--intro-delay","1.25s")}}catch(e){}`;

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  // latin covers every character on the page (ü, é included)
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Brand faces from Identify/font. Parabola converted from TTF to WOFF2.
const parabola = localFont({
  variable: "--font-parabola",
  src: "./fonts/Parabola.woff2",
  display: "swap",
  // not needed for the first paint (performance, 22.10.2026)
  preload: false,
});

const nkduy = localFont({
  variable: "--font-nkduy",
  src: [
    // subset to Latin-1 + quotes and arrows (fontTools); Medium was unused
    { path: "./fonts/NKDuyMono-Regular.woff2", weight: "400" },
  ],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "OPPAACHA · Press kit",
  description: "OPPAACHA electronic press kit: showreel, live sets, support, photos, rider and booking.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${hanken.variable} ${parabola.variable} ${nkduy.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <div className="preloader" aria-hidden>
          <div
            className="preloader-mark"
            style={{ "--mark": `url(${asset("/media/brand/oppaacha-grunge-red.webp")})` } as CSSProperties}
          >
            <img src={asset("/media/brand/oppaacha-grunge-red-800.webp")} alt="" decoding="async" />
            <span />
          </div>
        </div>
        <SmoothScroll />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
