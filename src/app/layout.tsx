import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { business } from "@/config/business";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";
import "./motion.css";

const serif = localFont({ src: [ { path: "../fonts/CormorantGaramond-Regular.woff2", weight: "400", style: "normal" }, { path: "../fonts/CormorantGaramond-Italic.woff2", weight: "400", style: "italic" } ], variable: "--font-serif", display: "swap" });
const sans = localFont({ src: "../fonts/DMSans.woff2", variable: "--font-sans", display: "swap", weight: "100 900" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const title = "Cream on Top by Neha Gupta | Bespoke Cakes in Bangalore";
const description = "Thoughtfully crafted custom cakes in Bangalore by Neha Gupta. Discover designer birthday cakes, wedding cakes and personalised celebrations, and create your own sweet story.";

export const metadata: Metadata = {
  title, description,
  metadataBase: new URL(siteUrl || "http://127.0.0.1:3000"),
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  keywords: ["custom cakes in Bangalore", "designer cakes Bangalore", "birthday cakes Bangalore", "wedding cakes Bangalore", "personalised cakes Bangalore", "Cream on Top by Neha Gupta"],
  openGraph: { title, description, type: "website", locale: "en_IN", siteName: "Cream on Top by Neha Gupta", images: [{ url: "/images/hero/hero-princess.webp", width: 1080, height: 1294, alt: "A pastel floral princess cake by Cream on Top" }], ...(siteUrl ? { url: siteUrl } : {}) },
  twitter: { card: "summary_large_image", title, description, images: ["/images/hero/hero-princess.webp"] },
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f8f1ec" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@type": "Bakery", name: "Cream on Top by Neha Gupta", description, founder: { "@type": "Person", name: "Neha Gupta" }, address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" }, sameAs: [business.instagramUrl], ...(siteUrl ? { url: siteUrl } : {}) };
  return <html lang="en-IN" className={`${serif.variable} ${sans.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/><MotionProvider>{children}</MotionProvider></body></html>;
}
