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

// Runs before paint: the preloader plays once per session, and the hero
// intro waits for it only on that first visit.
const introScript = `try{var d=document.documentElement;d.dataset.js="";if(sessionStorage.getItem("opp-intro")){d.dataset.introSeen=""}else{sessionStorage.setItem("opp-intro","1");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.style.setProperty("--intro-delay","1.25s")}}catch(e){}`;

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Brand faces from Identify/font. Parabola converted from TTF to WOFF2.
const parabola = localFont({
  variable: "--font-parabola",
  src: "./fonts/Parabola.woff2",
  display: "swap",
});

const nkduy = localFont({
  variable: "--font-nkduy",
  src: [
    { path: "./fonts/NKDuyMono-Regular.woff2", weight: "400" },
    { path: "./fonts/NKDuyMono-Medium.woff2", weight: "500" },
  ],
  display: "swap",
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
            <img src={asset("/media/brand/oppaacha-grunge-red.webp")} alt="" />
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
