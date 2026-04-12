export type EatiCtaContextType = "blog" | "programmatic" | "tool";

/** Shown under the headline for blog + tool; programmatic adds a meal-specific line. */
export const EATI_CTA_PRODUCT_SUBTEXT =
  "Eati lets you log meals as chatting and instantly see calories & protein.";

export const EATI_CTA_FEATURE_HIGHLIGHT = "Log meals as chatting";

export const EATI_CTA_SOCIAL_PROOF =
  "Used by people to stay in a calorie deficit";

const CTA_IMAGES = ["/images/cta1.png", "/images/cta2.png", "/images/cta3.png"] as const;

function hashSeed(parts: string[]): number {
  const s = parts.join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(items: readonly T[], seed: number): T {
  return items[seed % items.length];
}

function normalizeTopic(topic: string): string {
  return topic.trim().toLowerCase();
}

function blogHeadlinePool(topic: string): string[] {
  const t = normalizeTopic(topic);
  const pool: string[] = [
    "Eating healthy is easy. Tracking it correctly is not.",
    "Most people fail fat loss because they guess portions.",
    "These recipes help — but without tracking, results are inconsistent.",
  ];

  if (/(protein|recipe|meal|muscle|macro|chicken|steak|fish|egg)/.test(t)) {
    pool.unshift(
      "These ideas help — but without tracking, results are inconsistent.",
      "High-protein meals only work if you log what you actually eat."
    );
  }
  if (/(calorie|deficit|fat|loss|weight|track|cut|burn)/.test(t)) {
    pool.unshift(
      "Most people miss their deficit because they guess portions.",
      "A plan only works when your log matches real life."
    );
  }
  return pool;
}

function programmaticHeadlinePool(productName?: string): string[] {
  const name = productName?.trim();
  if (name) {
    return [
      `Want exact macros for ${name}?`,
      `Logging ${name} should take seconds, not spreadsheets.`,
      `Turn ${name} into a tracked meal — not a guess.`,
    ];
  }
  return [
    "Want exact macros for this meal?",
    "Know the numbers — then track them without friction.",
    "Stop estimating portions after you already looked them up.",
  ];
}

function programmaticExtraLine(productName?: string): string {
  const name = productName?.trim();
  if (name) {
    return `Calculate and track ${name} (and full meals) automatically with Eati.`;
  }
  return "Calculate and track this meal automatically with Eati.";
}

function toolHeadlinePool(topic: string): string[] {
  const t = normalizeTopic(topic);
  const defaults = [
    "Numbers are a start — consistent logging is what changes results.",
    "Now turn this estimate into a daily habit you will actually keep.",
  ];

  if (/(macro|protein|carb|fat gram)/.test(t)) {
    return [
      "Start logging your macros in seconds with Eati",
      "Macro targets work best when logging feels effortless.",
      ...defaults,
    ];
  }
  if (/(calorie|tdee|bmr|deficit|surplus|burn|meal log)/.test(t)) {
    return [
      "Now track your daily intake automatically with Eati",
      "Your target is set — next, make logging match real life.",
      ...defaults,
    ];
  }
  if (/(bmi|ideal body|ibw|weight)/.test(t)) {
    return [
      "Pair this snapshot with daily tracking that stays easy.",
      "Use your result as a guide — then log meals without the grind.",
      ...defaults,
    ];
  }
  if (/(water|hydration)/.test(t)) {
    return [
      "Hydration matters — and so does everything else you eat in a day.",
      "Track food and drinks in one flow with Eati.",
      ...defaults,
    ];
  }
  if (/(body fat|analytics|photo)/.test(t)) {
    return [
      "Track composition changes alongside what you eat every day.",
      "Estimates are useful — pairing them with meal logging is better.",
      ...defaults,
    ];
  }
  return defaults;
}

/** Stable per page: derived from context + topic (+ product), not tied to image rotation. */
export function resolveEatiCtaButtonLabel(args: {
  contextType: EatiCtaContextType;
  topic: string;
  variant?: string;
  productName?: string;
}): string {
  const { contextType, topic, variant = "", productName } = args;
  const seed = hashSeed([contextType, topic, variant, productName ?? "", "cta_btn"]);

  if (contextType === "blog") {
    const labels = [
      "Log your meals with AI →",
      "Start tracking in seconds",
      "Download FREE",
    ] as const;
    return labels[seed % labels.length];
  }

  if (contextType === "programmatic") {
    const labels = [
      "Track this meal now →",
      "Log your meals with AI →",
      "Start tracking in seconds",
    ] as const;
    return labels[seed % labels.length];
  }

  const t = normalizeTopic(topic);
  if (/(macro)/.test(t)) return "Log your macros with AI →";
  if (/(protein)/.test(t) && !/(macro)/.test(t)) return "Hit your protein target with AI →";
  if (/(calorie|tdee|bmr|deficit|surplus|burn|meal log)/.test(t)) {
    return "Track your daily intake with AI →";
  }
  if (/(water|hydration)/.test(t)) return "Log meals & drinks with AI →";
  if (/(body fat|analytics|photo)/.test(t)) return "Track meals & progress with AI →";
  if (/(bmi|ideal body|ibw)/.test(t)) return "Turn this into a daily logging habit →";

  const fallback = [
    "Log your meals with AI →",
    "Start tracking in seconds",
    "Download FREE",
  ] as const;
  return fallback[seed % fallback.length];
}

export interface EatiCtaResolvedCopy {
  headline: string;
  subtext: string;
  /** Extra line (e.g. programmatic meal tracking). */
  subtextAddon?: string;
  featureHighlight: string;
  socialProof: string;
  buttonLabel: string;
  imagePaths: readonly string[];
}

export function resolveEatiCtaCopy(args: {
  contextType: EatiCtaContextType;
  topic: string;
  variant?: string;
  productName?: string;
}): EatiCtaResolvedCopy {
  const { contextType, topic, variant = "", productName } = args;
  const seed = hashSeed([contextType, topic, variant, productName ?? ""]);

  let headline: string;
  let subtext: string;
  let subtextAddon: string | undefined;

  if (contextType === "blog") {
    headline = pick(blogHeadlinePool(topic), seed);
    subtext = EATI_CTA_PRODUCT_SUBTEXT;
  } else if (contextType === "programmatic") {
    headline = pick(programmaticHeadlinePool(productName), seed);
    subtext = EATI_CTA_PRODUCT_SUBTEXT;
    subtextAddon = programmaticExtraLine(productName);
  } else {
    headline = pick(toolHeadlinePool(topic), seed);
    subtext = EATI_CTA_PRODUCT_SUBTEXT;
  }

  const buttonLabel = resolveEatiCtaButtonLabel({
    contextType,
    topic,
    variant,
    productName,
  });

  return {
    headline,
    subtext,
    subtextAddon,
    featureHighlight: EATI_CTA_FEATURE_HIGHLIGHT,
    socialProof: EATI_CTA_SOCIAL_PROOF,
    buttonLabel,
    imagePaths: CTA_IMAGES,
  };
}

export function blogTopicFromArticle(input: {
  targetKeyword?: string;
  title: string;
}): string {
  const kw = input.targetKeyword?.trim();
  if (kw) return kw;
  return input.title;
}
