import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

/*
 * Typefaces are self-hosted from the Fontsource packages (SIL Open Font
 * License), so builds never depend on reaching a third-party font server.
 * Bodoni Moda: variable weight + optical size. Instrument Sans: variable weight.
 */
const display = localFont({
  src: "../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-standard-normal.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-bodoni",
  display: "swap",
  // next/font emits these unquoted, so names must be plain identifiers (no "Bodoni 72").
  fallback: ["Didot", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const text = localFont({
  src: "../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name}, braided gold jewelry from raw gold`,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#100d0a",
  colorScheme: "dark",
};

/**
 * Runs before first paint: marks that JS is available and, unless reduced
 * motion is requested, holds the page behind the intro curtain. A timer
 * releases the page if the app script never arrives.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-pending');window.__introFailsafe=window.setTimeout(function(){d.classList.remove('intro-pending')},6000)}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
