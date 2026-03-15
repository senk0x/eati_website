import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eati - AI Calorie Tracker | Track Calories & Macros in Seconds",
  description:
    "Track calories and macros in seconds with AI. Snap a photo of your meal, get instant nutrition. Free calorie calculator, TDEE, macro calculator, and weight loss tools.",
  openGraph: {
    title: "Eati - AI Calorie Tracker | Track Calories & Macros in Seconds",
    description:
      "Track calories and macros in seconds with AI. Free calorie calculator, TDEE, macro calculator, and weight loss tools.",
  },
  alternates: { canonical: "/" },
};

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
      </main>

      <Footer />
    </div>
  );
}
