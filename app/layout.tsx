import type { Metadata } from "next";
import { MocLoadingIntro } from "@/components/ui/MocLoadingIntro";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOC / Minus One Coffee",
  description: "Small-batch coffee, matcha, and chocolate made at home and shared through Instagram.",
  openGraph: {
    title: "MOC / Minus One Coffee",
    description: "Small-batch drinks, made at home and shared fresh.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* DESIGN CONTRACT e4f14b66: MOC is a menu poster, not a boxed cafe template. */}
        <script
          id="design-contract"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              seed: "e4f14b66",
              thesis: "Make MOC a living menu poster and move visitors into a truthful Instagram DM.",
              world: "Espresso Black, Dark Cocoa, Walnut Brown, Aged Copper, Warm Ivory, Muted Beige, Soft Olive, Coffee Line, and Deep Black.",
              firstViewport: "MOC logo intro, oversized Minus One Coffee title, a raw 3D drink scene and one clear DM action.",
              form: "Poster-first asymmetric editorial surface, candidate 7 assigned by direction seed."
            })
          }}
        />
        <MocLoadingIntro />
        {children}
      </body>
    </html>
  );
}
