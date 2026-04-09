/**
 * Optional SERP copy variants for high-traffic tool pages (A/B hypotheses).
 *
 * Production baseline: omit `NEXT_PUBLIC_TOOLS_SERP_AB` or leave it unset.
 * Preview / experiment: set to `pain` or `curiosity`, deploy, compare CTR in
 * Search Console over 2–3 weeks before scaling.
 *
 * Values: `default` (implicit) | `pain` | `curiosity`
 */

export type ToolsSerpAbVariant = "default" | "pain" | "curiosity";

export type ToolSerpAbKey =
  | "calorie-calculator"
  | "tdee-calculator"
  | "meal-log-calculator"
  | "tools";

export function getToolsSerpAbVariant(): ToolsSerpAbVariant {
  const raw = process.env.NEXT_PUBLIC_TOOLS_SERP_AB?.trim().toLowerCase();
  if (raw === "pain" || raw === "curiosity") return raw;
  return "default";
}

/** Baseline titles & descriptions (current production defaults). */
const SERP_BASE: Record<ToolSerpAbKey, { title: string; description: string }> = {
  "calorie-calculator": {
    title: "Calorie Calculator Free | Find Your Daily Calories",
    description:
      "Add your stats—see daily calories to cut, maintain, or bulk from BMR plus TDEE. Know exactly what to aim for; metric or imperial. No signup.",
  },
  "tdee-calculator": {
    title: "TDEE Calculator Free | Know What You Burn Daily",
    description:
      "BMR plus your activity level rolls into one maintenance calorie number—finally see what eating at TDEE means for you. Quick result, no fluff. No account needed.",
  },
  "meal-log-calculator": {
    title: "Meal Calorie Calculator | Macros From What You Ate",
    description:
      "Type your meal—see calories, protein, carbs, and fat in one quick result before logging a full day. A simple sanity check with no signup required.",
  },
  tools: {
    title: "Free TDEE & Calorie Calculators | No Signup",
    description:
      "Calories, TDEE, macros, protein, BMI, body fat, hydration, and more—all free, quick results, zero signup. Pick a tool and get your numbers now.",
  },
};

/** Pattern-interrupt / pain hooks (hypothesis: higher CTR on problem-aware queries). */
const SERP_PAIN: Record<ToolSerpAbKey, { title: string; description: string }> = {
  "calorie-calculator": {
    title: "Calorie Calculator | Stop Guessing Your Calories",
    description:
      "Enter your stats—get one clear daily calorie number for cut, maintain, or bulk from BMR plus TDEE. No guesswork; metric or imperial. No signup.",
  },
  "tdee-calculator": {
    title: "TDEE Calculator | No More Calorie Guesswork",
    description:
      "BMR plus activity becomes one exact maintenance calorie answer—finally stop wondering what TDEE means for you. Plain numbers, no fluff. No account needed.",
  },
  "meal-log-calculator": {
    title: "Meal Calorie Calculator | Avoid Undereating by Mistake",
    description:
      "Type what you ate—see calories and macros in one view so you do not accidentally finish the day too low. Clear totals before you commit. No signup required.",
  },
  tools: {
    title: "Free TDEE & Calorie Calculators | Get Results Fast",
    description:
      "Calories, TDEE, macros, protein, BMI, body fat, hydration—each tool gives a clear answer with zero signup. Pick one and see your number without guesswork.",
  },
};

/** Curiosity + clarity (hypothesis: higher CTR when outcome feels discoverable). */
const SERP_CURIOSITY: Record<ToolSerpAbKey, { title: string; description: string }> = {
  "calorie-calculator": {
    title: "Calorie Calculator | See Your True Daily Calories",
    description:
      "A few inputs—discover the daily calories your body needs to cut, maintain, or bulk, from BMR plus TDEE. One exact target; metric or imperial. No signup.",
  },
  "tdee-calculator": {
    title: "TDEE Calculator | Your Real Maintenance Calories",
    description:
      "See the maintenance calories you actually burn when BMR meets your real activity level. One number to plan cuts or surplus around. No account needed.",
  },
  "meal-log-calculator": {
    title: "Meal Calorie Calculator | See If You Ate Enough",
    description:
      "Describe your plate—get calories, protein, carbs, and fat in an instant answer before you log the rest of the day. Spot gaps early. No signup required.",
  },
  tools: {
    title: "Free TDEE & Calorie Calculators | Clear Numbers Fast",
    description:
      "From calorie targets to TDEE and macros—every calculator returns one easy-to-read result. All free, no signup. Open a tool and get your answer now.",
  },
};

export function toolSerpAb(key: ToolSerpAbKey): { title: string; description: string } {
  const variant = getToolsSerpAbVariant();
  if (variant === "pain") return SERP_PAIN[key];
  if (variant === "curiosity") return SERP_CURIOSITY[key];
  return SERP_BASE[key];
}
