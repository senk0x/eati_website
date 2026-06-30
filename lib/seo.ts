import type { Metadata } from "next";

/** Canonical site origin, no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://eatiapp.com"
).replace(/\/$/, "");

/** iOS App Store listing (partner token + campaign tag for attribution). */
const EATI_APP_STORE_LISTING_PATH = "/app/apple-store/id6758241088";

export function eatiAppStoreUrl(campaignTag: string): string {
  const u = new URL(EATI_APP_STORE_LISTING_PATH, "https://apps.apple.com");
  u.searchParams.set("pt", "127995771");
  u.searchParams.set("ct", campaignTag.slice(0, 120));
  u.searchParams.set("mt", "8");
  return u.toString();
}

/** Screaming Frog / SERP length targets. */
export const SEO_TITLE_MAX = 60;
export const SEO_TITLE_MIN = 30;
/** Approximate max width before Google truncates (~561px in SF). */
export const SEO_TITLE_PIXEL_MAX = 561;
export const SEO_DESCRIPTION_MAX = 155;
export const SEO_ALT_MAX = 100;
export const SEO_H1_MAX = 70;

/** Default marketing title/description (root layout + fallbacks). */
export const DEFAULT_SITE_TITLE =
  "Eati - AI Calorie Tracker App | Fat Loss & Macro Logging";
export const DEFAULT_SITE_DESCRIPTION =
  "Log meals in seconds with AI: photo, text, barcode, or voice. Free TDEE, calorie and macro calculators. Fat loss app for iOS without tedious logging.";

/** Rough pixel width for Latin SERP titles (SF uses a similar estimate). */
export function estimateTitlePixels(title: string): number {
  let px = 0;
  for (const ch of title) {
    if (ch === " " || ch === "|") px += 4;
    else if (ch === "-" || ch === "—") px += 6;
    else if (/[WMmw@%]/.test(ch)) px += 12;
    else if (/[A-Z]/.test(ch)) px += 10;
    else px += 7;
  }
  return px;
}

/** Trim and cap copy for title tags, meta descriptions, and image alt text. */
export function truncateSeoText(text: string, maxLen: number): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLen) return trimmed;
  const cut = trimmed.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > maxLen * 0.55 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}

export function normalizeSeoTitle(title: string): string {
  let t = title.replace(/\s*\|\s*Eati\s*$/i, "").trim().replace(/—/g, "-");
  const hasBrand = /\bEati\b/i.test(t);
  if (!hasBrand) {
    const branded = `${t} | Eati`;
    if (branded.length <= SEO_TITLE_MAX && estimateTitlePixels(branded) <= SEO_TITLE_PIXEL_MAX) {
      t = branded;
    }
  }
  if (t.length > SEO_TITLE_MAX) {
    t = truncateSeoText(t, SEO_TITLE_MAX);
  }
  while (estimateTitlePixels(t) > SEO_TITLE_PIXEL_MAX && t.length > SEO_TITLE_MIN) {
    t = truncateSeoText(t, t.length - 4).replace(/…$/, "").trim();
  }
  if (t.length < SEO_TITLE_MIN) {
    const padded = `${t} | Free Nutrition App`;
    t =
      padded.length <= SEO_TITLE_MAX && estimateTitlePixels(padded) <= SEO_TITLE_PIXEL_MAX
        ? padded
        : truncateSeoText(padded, SEO_TITLE_MAX);
  }
  return t;
}

export function normalizeSeoDescription(description: string): string {
  return truncateSeoText(description, SEO_DESCRIPTION_MAX);
}

export function normalizeImageAlt(alt: string): string {
  if (!alt.trim()) return alt;
  return truncateSeoText(alt, SEO_ALT_MAX);
}

export function normalizePageHeading(text: string): string {
  return truncateSeoText(text, SEO_H1_MAX);
}

/** Programmatic food detail pages — keep titles within SERP limits. */
export function foodPageTitle(name: string): string {
  const suffix = " Calories & Macros | Eati";
  const maxNameLen = SEO_TITLE_MAX - suffix.length;
  const shortName =
    name.length > maxNameLen
      ? truncateSeoText(name, maxNameLen).replace(/…$/, "").trim()
      : name;
  return `${shortName}${suffix}`;
}

export function foodPageDescription(
  name: string,
  macros: {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
  }
): string {
  return normalizeSeoDescription(
    `${name}: ${macros.caloriesPer100g} kcal, ${macros.proteinPer100g}g protein, ${macros.carbsPer100g}g carbs, ${macros.fatPer100g}g fat per 100g. Meal planning with Eati.`
  );
}

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
  "Eati calorie tracker — chat-style meal log with macros on iPhone";

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
  const seoTitle = normalizeSeoTitle(title);
  const seoDescription = normalizeSeoDescription(description);
  const seoOgAlt = normalizeImageAlt(ogImageAlt);
  const imageDims =
    ogImagePath === BRAND_OG_SHARE_IMAGE_PATH ? BRAND_OG_IMAGE_SIZE : OG_IMAGE_SIZE;
  const ogImages = [
    {
      url: ogImagePath,
      ...imageDims,
      alt: seoOgAlt,
      type: "image/png" as const,
    },
  ];
  const twitterImagePath =
    ogImagePath === DEFAULT_OG_IMAGE_PATH ? DEFAULT_TWITTER_IMAGE_PATH : ogImagePath;

  return {
    title: { absolute: seoTitle },
    description: seoDescription,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
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
      title: seoTitle,
      description: seoDescription,
      images: {
        url: twitterImagePath,
        ...(twitterImagePath === BRAND_OG_SHARE_IMAGE_PATH ? BRAND_OG_IMAGE_SIZE : imageDims),
        alt: seoOgAlt,
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
