import type { Metadata, Viewport } from "next";
import { Montserrat, Mynerve } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { JsonLd } from "@/components/shared/JsonLd";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import { getSiteOriginForMetadata } from "@/lib/site-origin";
import { getKnowledgeBase } from "@/lib/catalog";
import { buildDanceSchoolJsonLd } from "@/lib/structured-data";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const mynerve = Mynerve({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mynerve",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2d1f3d" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1346" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "C4 Flow | Pole & Exotic Dance Studio in Cape Town",
    template: "%s | C4 Flow",
  },
  description:
    "C4 Flow Studio offers pole dancing classes in Cape Town, with group and private sessions for all levels at our inclusive Woodstock studio.",
  metadataBase: new URL(getSiteOriginForMetadata()),
  keywords: [
    "pole dancing classes Cape Town",
    "pole and exotic dance classes",
    "exotic dance studio Cape Town",
    "pole fitness Cape Town",
    "dance classes Woodstock",
    "private pole dance lessons Cape Town",
    "pole dancing beginners Cape Town",
    "Woodstock Exchange dance studio",
  ],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: { type: "website", locale: "en_ZA", siteName: "C4 Flow" },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const knowledge = await getKnowledgeBase();
  const { site } = knowledge;

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${mynerve.variable} scroll-smooth`}
      style={{ "--header-h": "65px", "--banner-h": "0px" } as React.CSSProperties}
    >
      <head>
        <link rel="alternate" type="application/json" href="/knowledge.json" title="C4 Flow knowledge base" />
        <link rel="alternate" type="application/json" href="/classes.json" title="C4 Flow classes feed" />
        <link rel="alternate" type="application/json" href="/schedule.json" title="C4 Flow schedule feed" />
        <link rel="alternate" type="application/json" href="/pricing.json" title="C4 Flow pricing feed" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="C4 Flow llms.txt" />
        <JsonLd data={buildDanceSchoolJsonLd(knowledge)} />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ScrollToTop />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Header siteName={site.name} logoUrl={site.logoUrl} />
        {children}
        <Footer
          siteName={site.name}
          logoUrl={site.logoUrl}
          email={site.email}
          phone={site.phone}
          instagramUrl={site.instagramUrl}
          address={{
            building: site.address.building || undefined,
            street: site.address.street,
            city: site.address.city,
          }}
          mapsUrl={site.mapsUrl}
          bookingUrl={site.bookingUrl}
        />
        {site.whatsappNumber && (
          <WhatsAppButton
            phoneNumber={site.whatsappNumber}
            message={site.whatsappMessage || undefined}
          />
        )}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
