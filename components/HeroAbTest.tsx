"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import {
  pickHeroAbVariant,
  readHeroAbVariantClient,
  setHeroAbCookie,
  type HeroAbVariant,
} from "@/lib/hero-ab";
import {
  setAnalyticsHeroVariant,
  trackAnalyticsEvent,
} from "@/lib/site-analytics/client";

const HeroSectionV2 = dynamic(() => import("@/components/HeroSectionV2"), {
  loading: () => <HeroAbSkeleton />,
});

function HeroAbSkeleton() {
  return (
    <section className="px-4 sm:px-5 md:px-6" aria-hidden>
      <div className="mx-auto max-w-7xl">
        <div
          className="min-h-[min(680px,100svh)] animate-pulse rounded-[2rem] md:min-h-[500px] md:rounded-[3rem] lg:min-h-[540px]"
          style={{
            background: "linear-gradient(180deg, #68AFFF 0%, #CFE3FF 100%)",
          }}
        />
      </div>
    </section>
  );
}

export default function HeroAbTest() {
  const [variant, setVariant] = useState<HeroAbVariant>(
    () => readHeroAbVariantClient() ?? "interactive"
  );

  useEffect(() => {
    const existing = readHeroAbVariantClient();
    const assigned = existing ?? pickHeroAbVariant();

    if (!existing) {
      setHeroAbCookie(assigned);
      trackAnalyticsEvent("hero_ab_assigned", { variant: assigned });
    }

    setAnalyticsHeroVariant(assigned);
    trackAnalyticsEvent("hero_ab_impression", { variant: assigned });
    setVariant(assigned);
  }, []);

  if (variant === "visual") {
    return <HeroSectionV2 />;
  }

  return <HeroSection />;
}
