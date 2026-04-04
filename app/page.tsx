import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HomeSeoContent from "@/components/HomeSeoContent";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { OG_HOME_ALT, OG_HOME_IMAGE_PATH } from "@/lib/og";
import {
  buildPageMetadata,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
} from "@/lib/seo";

const ReviewsSection = dynamic(() => import("@/components/ReviewsSection"), {
  loading: () => (
    <div
      className="min-h-[380px] w-full bg-white"
      aria-hidden
    />
  ),
});

export const metadata: Metadata = buildPageMetadata({
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  path: "/",
  ogImagePath: OG_HOME_IMAGE_PATH,
  ogImageAlt: OG_HOME_ALT,
  keywords: [
    "AI calorie tracker",
    "fat loss app",
    "meal planner",
    "macro tracker",
    "calorie counter",
    "weight loss app",
  ],
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="space-y-2 sm:space-y-4 md:space-y-6">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <ReviewsSection />
        <HomeSeoContent />
      </main>

      <Footer />
    </div>
  );
}
