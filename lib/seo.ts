import type { Metadata } from "next";

/** Canonical site origin, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://eatiapp.com"
).replace(/\/$/, "");

/** Default marketing title/description (root layout + fallbacks). */
export const DEFAULT_SITE_TITLE =
  "Eati — AI Calorie Tracker App | Fat Loss & Macro Logging";
export const DEFAULT_SITE_DESCRIPTION =
  "Log meals in seconds with AI: photo, text, barcode, or voice. Free TDEE, calorie & macro calculators. The fat loss and meal-planning app for iOS — stay consistent without tedious logging.";

/** Next.js metadata routes: explicit URLs satisfy OG/Twitter validators (image + dimensions + alt). */
export const DEFAULT_OG_IMAGE_PATH = "/opengraph-image";
export const DEFAULT_TWITTER_IMAGE_PATH = "/twitter-image";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
export const DEFAULT_OG_IMAGE_ALT =
  "Eati — AI calorie tracker app: log meals, track macros, and plan nutrition";

/** Dynamic blog post OG image (see `generateImageMetadata` id `default`; uses article cover when set). */
export function blogPostOgImagePath(slug: string): string {
  return `/blog/${slug}/opengraph-image/default`;
}

export function foodDetailOgImagePath(slug: string): string {
  return `/foods/${slug}/opengraph-image/default`;
}

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
  /**
   * Relative image URL for og:image and twitter:image (defaults to site OG).
   * Blog posts should use `blogPostOgImagePath(slug)`.
   */
  ogImagePath?: string;
  ogImageAlt?: string;
};

const defaultOgImageDescriptor = {
  url: DEFAULT_OG_IMAGE_PATH,
  ...OG_IMAGE_SIZE,
  alt: DEFAULT_OG_IMAGE_ALT,
  type: "image/png" as const,
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
  ogImagePath = DEFAULT_OG_IMAGE_PATH,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImages = [
    {
      url: ogImagePath,
      ...OG_IMAGE_SIZE,
      alt: ogImageAlt,
      type: "image/png" as const,
    },
  ];
  const twitterImagePath =
    ogImagePath === DEFAULT_OG_IMAGE_PATH ? DEFAULT_TWITTER_IMAGE_PATH : ogImagePath;

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
      images: ogImages,
      ...(publishedTime
        ? {
            publishedTime,
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : {}),
      ...(type === "article" ? { authors: [SITE_URL] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: {
        url: twitterImagePath,
        ...OG_IMAGE_SIZE,
        alt: ogImageAlt,
      },
    },
  };
}

/** Root layout Open Graph/Twitter defaults (merged with page metadata). */
export const rootOpenGraphDefaults: Metadata["openGraph"] = {
  type: "website",
  locale: "en_US",
  siteName: "Eati",
  url: SITE_URL,
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  images: [defaultOgImageDescriptor],
};

export const rootTwitterDefaults: Metadata["twitter"] = {
  card: "summary_large_image",
  title: DEFAULT_SITE_TITLE,
  description: DEFAULT_SITE_DESCRIPTION,
  images: {
    url: DEFAULT_TWITTER_IMAGE_PATH,
    ...OG_IMAGE_SIZE,
    alt: DEFAULT_OG_IMAGE_ALT,
  },
};
