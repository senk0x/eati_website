import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Roboto_Flex, Rubik, Bowlby_One } from "next/font/google";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eati.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eati - AI Calorie Tracker | Track Calories & Macros in Seconds",
    template: "%s | Eati",
  },
  description:
    "Track calories & macros without the hassle. Just snap a photo and let the app do the work. Free calorie calculator, TDEE, macro calculator, and nutrition tools.",
  keywords: [
    "calorie tracker",
    "AI calorie counter",
    "macro calculator",
    "TDEE calculator",
    "weight loss app",
    "calorie calculator",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eati",
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
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
      </body>
    </html>
  );
}
