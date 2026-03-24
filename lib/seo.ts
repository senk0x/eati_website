import type { Metadata } from "next";

/** Canonical site origin, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://eatiapp.com"
).replace(/\/$/, "");

/** Absolute URL for a path or external URL. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path starting with /, e.g. /tools/calorie-calculator */
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  /** ISO date for blog posts (Open Graph article). */
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Consistent Open Graph + Twitter Card metadata for static and dynamic pages.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "Eati",
      locale: "en_US",
      ...(publishedTime
        ? {
            publishedTime,
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
