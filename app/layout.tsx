import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono, Roboto_Flex, Rubik, Bowlby_One } from "next/font/google";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLdDefaults from "@/components/JsonLdDefaults";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  weight: ["900"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bowlbyOne = Bowlby_One({
  variable: "--font-bowlby-one",
  subsets: ["latin"],
  weight: "400",
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
    default: "Eati — AI Calorie Tracker App | Fat Loss & Macro Logging",
    template: "%s | Eati",
  },
  description:
    "Log meals in seconds with AI: photo, text, barcode, or voice. Free TDEE, calorie & macro calculators. The fat loss and meal-planning app for iOS — stay consistent without tedious logging.",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eati",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoFlex.variable} ${rubik.variable} ${bowlbyOne.variable} antialiased`}
      >
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
