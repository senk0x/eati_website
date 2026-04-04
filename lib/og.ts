/**
 * Open Graph image routes and per-page visuals (1200×630 social previews).
 * Prefer file-based opengraph-image.* under app/ when the segment exists; use /api/og/* for flat tool routes.
 */

/** Hero product shot used on the landing page features section (matches “try the app” UI). */
export const OG_HERO_FEATURE_IMAGE = "/images/feature-chat.png";

export const OG_HOME_IMAGE_PATH = "/api/og/home";

/** Tools index uses file convention at /tools/opengraph-image */
export const OG_TOOLS_INDEX_PATH = "/tools/opengraph-image";

export const OG_BLOG_INDEX_PATH = "/blog/opengraph-image";

export const OG_FOODS_INDEX_PATH = "/foods/opengraph-image";

export function ogToolPath(slug: ToolOgSlug): string {
  return `/api/og/tool/${slug}`;
}

export const TOOL_OG_SLUGS = [
  "bmi-calculator",
  "body-fat-analytics",
  "body-fat-calculator",
  "calorie-burn-calculator",
  "calorie-calculator",
  "calorie-deficit-calculator",
  "ideal-body-weight-calculator",
  "macro-goal-calculator",
  "meal-log-calculator",
  "protein-calculator",
  "tdee-calculator",
  "water-intake-calculator",
] as const;

export type ToolOgSlug = (typeof TOOL_OG_SLUGS)[number];

const TOOL_OG_SLUG_SET = new Set<string>(TOOL_OG_SLUGS);

export function isToolOgSlug(s: string): s is ToolOgSlug {
  return TOOL_OG_SLUG_SET.has(s);
}

/** Short titles for OG artwork (keep readable at 1200×630). */
export const TOOL_OG_TITLE: Record<ToolOgSlug, string> = {
  "bmi-calculator": "BMI Calculator",
  "body-fat-analytics": "Body Fat Analyzer (Photo)",
  "body-fat-calculator": "Body Fat Calculator",
  "calorie-burn-calculator": "Calorie Burn Calculator",
  "calorie-calculator": "Calorie Calculator",
  "calorie-deficit-calculator": "Calorie Deficit Calculator",
  "ideal-body-weight-calculator": "Ideal Body Weight",
  "macro-goal-calculator": "Macro Goal Calculator",
  "meal-log-calculator": "Meal Log Calculator",
  "protein-calculator": "Protein Calculator",
  "tdee-calculator": "TDEE Calculator",
  "water-intake-calculator": "Water Intake Calculator",
};

/**
 * Feature art per tool (main visual for that product area).
 * Paths are under /public; served as absolute URLs in OG routes.
 */
export const TOOL_OG_VISUAL: Record<ToolOgSlug, string> = {
  "calorie-calculator": "/images/feature-history.png",
  "tdee-calculator": "/images/feature-history.png",
  "macro-goal-calculator": "/images/feature-history.png",
  "calorie-deficit-calculator": "/images/feature-history.png",
  "meal-log-calculator": "/images/feature-chat.png",
  "protein-calculator": "/images/feature-chat.png",
  "bmi-calculator": "/images/feature-progress.png",
  "body-fat-calculator": "/images/feature-progress.png",
  "ideal-body-weight-calculator": "/images/feature-progress.png",
  "body-fat-analytics": "/images/feature-scan.png",
  "calorie-burn-calculator": "/images/feature-scan.png",
  "water-intake-calculator": "/images/feature-notifications.png",
};

export function toolOgAlt(slug: ToolOgSlug): string {
  return `${TOOL_OG_TITLE[slug]} — free Eati nutrition & weight loss tool`;
}

export const OG_HOME_ALT =
  "Eati AI calorie tracker app — chat-style meal log and macro tracking on iPhone";

export const OG_TOOLS_INDEX_ALT =
  "Eati free fitness calculators — TDEE, macros, BMI, body fat, calories, and more";

export const OG_BLOG_INDEX_ALT =
  "Eati nutrition blog — calorie tracking, weight loss guides, high-protein recipes, and macro tips";

export const OG_FOODS_INDEX_ALT =
  "Eati food nutrition database — calories, protein, carbs, and fat per 100g for common foods";
