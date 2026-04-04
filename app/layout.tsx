import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Rubik, Bowlby_One } from "next/font/google";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLdDefaults from "@/components/JsonLdDefaults";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  rootOpenGraphDefaults,
  rootTwitterDefaults,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

/** Only fonts used in UI (headings + body copy). Omitting unused families cuts render-blocking font CSS. */
const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  adjustFontFallback: true,
  display: "swap",
});

const bowlbyOne = Bowlby_One({
  variable: "--font-bowlby-one",
  subsets: ["latin"],
  weight: "400",
  adjustFontFallback: true,
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: "%s | Eati",
  },
  description: DEFAULT_SITE_DESCRIPTION,
  keywords: [
    "AI calorie tracker",
    "fat loss app",
    "meal planner",
    "macro tracker",
    "calorie counter",
    "TDEE calculator",
    "weight loss app",
    "nutrition app",
  ],
  openGraph: rootOpenGraphDefaults,
  twitter: rootTwitterDefaults,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/new_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${bowlbyOne.variable} antialiased`}>
        <JsonLdDefaults />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <GoogleAnalytics />
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
