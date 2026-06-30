"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import HeroSectionV2 from "@/components/HeroSectionV2";
import {
  pickHeroAbVariant,
  setHeroAbCookie,
  type HeroAbVariant,
} from "@/lib/hero-ab";
import {
  setAnalyticsHeroVariant,
  trackAnalyticsEvent,
} from "@/lib/site-analytics/client";

interface HeroAbTestProps {
  /** Resolved on the server from the hero A/B cookie, if present. */
  initialVariant: HeroAbVariant | null;
}

export default function HeroAbTest({ initialVariant }: HeroAbTestProps) {
  const [variant, setVariant] = useState<HeroAbVariant>(
    () => initialVariant ?? "interactive"
  );

  useEffect(() => {
    if (initialVariant) {
      setAnalyticsHeroVariant(initialVariant);
      trackAnalyticsEvent("hero_ab_impression", { variant: initialVariant });
      return;
    }

    const assigned = pickHeroAbVariant();
    setHeroAbCookie(assigned);
    trackAnalyticsEvent("hero_ab_assigned", { variant: assigned });
    setAnalyticsHeroVariant(assigned);
    trackAnalyticsEvent("hero_ab_impression", { variant: assigned });
    setVariant(assigned);
  }, [initialVariant]);

  if (variant === "visual") {
    return <HeroSectionV2 />;
  }

  return <HeroSection />;
}
