import { ImageResponse } from "next/og";
import { HomeOpenGraphMarkup, OG_SIZE } from "@/lib/og/markup";
import { OG_HERO_FEATURE_IMAGE } from "@/lib/og";
import { absoluteUrl } from "@/lib/seo";

export const runtime = "edge";

/**
 * Home page social preview: hero-style product UI + brand (1200×630).
 * Crawlers fetch this URL; response is server-generated PNG.
 */
export async function GET() {
  const heroAbsoluteUrl = absoluteUrl(OG_HERO_FEATURE_IMAGE);
  return new ImageResponse(<HomeOpenGraphMarkup heroAbsoluteUrl={heroAbsoluteUrl} />, {
    ...OG_SIZE,
  });
}
