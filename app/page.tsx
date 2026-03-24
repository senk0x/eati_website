import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HomeSeoContent from "@/components/HomeSeoContent";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

const ReviewsSection = dynamic(() => import("@/components/ReviewsSection"), {
  loading: () => (
    <div
      className="min-h-[380px] w-full bg-white"
      aria-hidden
    />
  ),
});

export const metadata: Metadata = buildPageMetadata({
  title: "Eati — AI Calorie Tracker App | Fat Loss & Macro Logging",
  description:
    "Log meals in seconds with AI: photo, text, barcode, or voice. Free TDEE, calorie & macro calculators. The iOS fat loss and meal-planning app — stay consistent without tedious logging.",
  path: "/",
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
