import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Script from "next/script";

export const runtime = "edge";

/**
 * Font loading strategy:
 * - Cormorant Garamond: display-only, subset to latin, swap display
 * - DM Sans: body + UI, subset to latin, preloaded
 * - JetBrains Mono: mono details, optional subset (smaller budget)
 *
 * We use CSS variables so the fonts integrate with the @theme token system.
 */

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "NailVibe — Premium Press-On Nails",
    template: "%s | NailVibe",
  },
  description:
    "Handcrafted press-on nails for every occasion. Shop our curated nail sets, book custom designs, and find your perfect fit.",
  keywords: [
    "press-on nails",
    "custom nails",
    "nail art",
    "nail sets",
    "gel nails",
    "luxury nails",
    "handcrafted nails",
  ],
  openGraph: {
    type: "website",
    siteName: "NailVibe",
    title: "NailVibe — Premium Press-On Nails",
    description:
      "Handcrafted press-on nails for every occasion. Shop our curated nail sets, book custom designs, and find your perfect fit.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NailVibe — Premium Press-On Nails",
    description: "Handcrafted press-on nails for every occasion.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/* Cloudflare Web Analytics — cookieless, no consent banner */}
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col" style={{
        fontFamily: "var(--font-body-loaded, var(--font-body))",
      }}>
        <NuqsAdapter>
          {children}
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
