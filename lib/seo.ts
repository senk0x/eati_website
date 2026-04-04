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

/** Branded 1200×630 share art (Telegram, Facebook, Twitter, etc.). */
export const BRAND_OG_SHARE_IMAGE_PATH = "/images/og-share.png";

/** Next.js metadata: static file under /public for reliable crawler access. */
export const DEFAULT_OG_IMAGE_PATH = BRAND_OG_SHARE_IMAGE_PATH;
export const DEFAULT_TWITTER_IMAGE_PATH = BRAND_OG_SHARE_IMAGE_PATH;
/** Generated OG routes (tools, blog, foods) use this size. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
/** Actual pixel size of `BRAND_OG_SHARE_IMAGE_PATH` (public static art). */
export const BRAND_OG_IMAGE_SIZE = { width: 1024, height: 635 } as const;
export const DEFAULT_OG_IMAGE_ALT =
  "Eati — track your calories in seconds: chat-style meal log with macros and totals on iPhone";

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
  ...BRAND_OG_IMAGE_SIZE,
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
  const imageDims =
    ogImagePath === BRAND_OG_SHARE_IMAGE_PATH ? BRAND_OG_IMAGE_SIZE : OG_IMAGE_SIZE;
  const ogImages = [
    {
      url: ogImagePath,
      ...imageDims,
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
        ...(twitterImagePath === BRAND_OG_SHARE_IMAGE_PATH ? BRAND_OG_IMAGE_SIZE : imageDims),
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
    ...BRAND_OG_IMAGE_SIZE,
    alt: DEFAULT_OG_IMAGE_ALT,
  },
};
