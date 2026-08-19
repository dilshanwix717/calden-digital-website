import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeScript } from "@/components/layout/ThemeScript";
import "./globals.css";

/**
 * Outfit is the brand's real typeface, not a substitution.
 *
 * 400 / 500 / 600. The budget document asks for two weights on the premise that
 * "every additional weight is roughly 25KB" — that is true of static cuts, but
 * Outfit on Google Fonts is a VARIABLE font. next/font splits it by
 * unicode-range, not by weight, so all three weights resolve to the same two
 * files. Measured in Phase 1: 400/600 and 400/500/600 produce byte-identical
 * output (same file hashes, 32,228 + 14,760 bytes). Weight 500 is free, so the
 * design's real label weight is used rather than being mapped to 600.
 *
 * Only the latin file (32 KB) is fetched for English content; latin-ext loads
 * on demand. Total well inside the 60 KB font budget.
 *
 * next/font self-hosts at build time: no request to fonts.googleapis.com and
 * no preconnect needed, unlike the handoff's tokens/fonts.css.
 */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Calden — Web design and software development in Sri Lanka",
  description:
    "A software studio in Sri Lanka. We plan, design and build custom websites, web applications and software for businesses here and abroad.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: ThemeScript mutates <html> before React hydrates.
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
