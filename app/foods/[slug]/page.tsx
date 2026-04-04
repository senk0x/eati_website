import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import FoodPortionCalculator from '@/components/FoodPortionCalculator';
import { getFoodBySlug, getAllFoodSlugs, getRelatedFoods } from '@/lib/foods';
import { foodDetailOgImagePath, SITE_URL, buildPageMetadata } from '@/lib/seo';

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllFoodSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) return { title: 'Food Not Found' };
  const name = food.name;
  return buildPageMetadata({
    title: `${name} Calories & Macros | Nutrition per 100g`,
    description: `${name} nutrition: ${food.caloriesPer100g} kcal per 100g, ${food.proteinPer100g}g protein, ${food.carbsPer100g}g carbs, ${food.fatPer100g}g fat. Serving ideas for meal planning and fat loss with Eati.`,
    path: `/foods/${slug}`,
    ogImagePath: foodDetailOgImagePath(slug),
    ogImageAlt: `${name} nutrition facts — calories and macros per 100g on Eati`,
    keywords: [
      `${name.toLowerCase()} calories`,
      `calories in ${name.toLowerCase()}`,
      `${name.toLowerCase()} per 100g`,
      `nutrition facts for ${name.toLowerCase()}`,
      `${name.toLowerCase()} protein`,
      `is ${name.toLowerCase()} healthy`,
      `${name.toLowerCase()} for weight loss`,
    ],
  });
}

function scale(n: number, factor: number): number {
  return Math.round(n * factor * 10) / 10;
}

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

type FoodCopyInput = {
  name: string;
  slug: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

function getFoodCategory(name: string, slug: string): 'protein' | 'grain' | 'fruit' | 'vegetable' | 'dairy' | 'fat' | 'general' {
  const n = `${name} ${slug}`.toLowerCase();
  if (/(chicken|turkey|beef|salmon|tuna|fish|shrimp|pork|steak)/.test(n)) return 'protein';
  if (/(egg|eggs)/.test(n)) return 'protein';
  if (/(rice|oats|oatmeal|bread|pasta|noodle|quinoa|potato)/.test(n)) return 'grain';
  if (/(banana|apple|berries|strawberry|blueberry|orange|grape)/.test(n)) return 'fruit';
  if (/(broccoli|spinach|lettuce|tomato|cucumber|pepper|carrot)/.test(n)) return 'vegetable';
  if (/(milk|yogurt|cheese|cottage|kefir)/.test(n)) return 'dairy';
  if (/(olive oil|avocado|nuts|peanut butter|almond|butter)/.test(n)) return 'fat';
  return 'general';
}

function buildFoodCopy(input: FoodCopyInput) {
  const seed = hashString(input.slug);
  const nameLower = input.name.toLowerCase();
  const isHighProtein = input.proteinPer100g >= 15;
  const isLowCarb = input.carbsPer100g <= 5;
  const isHigherCarb = input.carbsPer100g >= 20;
  const isHigherFat = input.fatPer100g >= 10;
  const isLowerCal = input.caloriesPer100g <= 160;
  const category = getFoodCategory(input.name, input.slug);

  const intros = [
    `${input.name} is a simple staple that shows up in a lot of real-world diets because it is easy to portion, easy to repeat, and easy to track.`,
    `${input.name} is one of those “default” foods people come back to when they want predictable nutrition and a meal that fits their calorie target.`,
    `If you are building a routine around an AI calorie tracker, ${input.name} is the kind of food that makes tracking feel straightforward instead of fussy.`,
    `${input.name} can be a practical choice when you want food that is familiar, flexible, and easy to include in meal prep.`,
  ];

  const flavorStyle = pick(
    [
      `It works well as a base for balanced meals, because you can pair it with vegetables for volume, a protein source for satiety, and a sauce or seasoning for enjoyment.`,
      `It is easy to “dress up” with spices, herbs, and sauces, which helps you stay consistent without getting bored.`,
      `It fits both quick meals and meal prep, since you can cook it once and reuse it in different recipes across the week.`,
      `It is a good example of a food where portion size matters more than perfection—measure once, repeat often.`,
    ],
    seed + 7
  );

  const macroAngle = (() => {
    if (isHighProtein && isLowerCal) {
      return `Per 100g, ${input.name} is relatively high in protein (${input.proteinPer100g}g) for its calories (${input.caloriesPer100g} kcal). That combination is helpful when you want meals that feel filling while staying in a calorie deficit.`;
    }
    if (isHighProtein && isHigherFat) {
      return `Per 100g, ${input.name} gives you solid protein (${input.proteinPer100g}g) plus some fat (${input.fatPer100g}g). That can be great for satiety, but it also means portions matter if you are cutting.`;
    }
    if (isHigherCarb && !isHighProtein) {
      return `Per 100g, ${input.name} is more carb-forward (${input.carbsPer100g}g carbs), which makes it a useful energy source around training. Pair it with a lean protein to round out the macros.`;
    }
    if (isLowCarb && isHigherFat) {
      return `Per 100g, ${input.name} is low in carbs (${input.carbsPer100g}g) and provides fat (${input.fatPer100g}g). It can make meals taste satisfying, but it is easier to overshoot calories if you do not portion it.`;
    }
    return `Per 100g, ${input.name} has ${input.caloriesPer100g} calories, with ${input.proteinPer100g}g protein, ${input.carbsPer100g}g carbs, and ${input.fatPer100g}g fat. Use the serving table below to scale those numbers to your usual portions.`;
  })();

  const benefitBulletsBase = [
    isHighProtein
      ? `Helps you hit daily protein targets, which supports muscle maintenance during fat loss and recovery during training.`
      : `Pairs well with higher-protein foods, making it easy to build a balanced meal without guessing.`,
    isLowerCal
      ? `Works well for volume-friendly meals when you want to stay full on fewer calories.`
      : `Teaches portion awareness—use a repeatable serving size so your daily totals stay predictable.`,
    isLowCarb
      ? `Fits low-carb meal patterns and is easy to combine with high-fiber vegetables.`
      : `Provides useful energy from carbohydrates when you need performance and consistency.`,
    isHigherFat
      ? `Adds satisfaction and flavor to meals, which can make a long-term plan more enjoyable.`
      : `Keeps macros easier to manage when you want a simpler, leaner plate.`,
  ];

  const benefitBullets = pick(
    [
      benefitBulletsBase,
      [benefitBulletsBase[2], benefitBulletsBase[0], benefitBulletsBase[3], benefitBulletsBase[1]],
      [benefitBulletsBase[1], benefitBulletsBase[3], benefitBulletsBase[0], benefitBulletsBase[2]],
    ],
    seed + 19
  );

  const bestFor = {
    weightLoss: (() => {
      if (isLowerCal && isHighProtein) {
        return `${input.name} is a strong pick for weight loss because protein helps satiety, and the calorie density stays manageable when you keep portions consistent.`;
      }
      if (input.caloriesPer100g > 220) {
        return `${input.name} can still work for weight loss, but it is easier to overshoot calories. Use smaller servings and build the rest of the plate with vegetables and lean protein.`;
      }
      return `${input.name} can fit a weight loss plan when you track portions and keep your daily calorie target realistic.`;
    })(),
    muscleGain: (() => {
      if (isHighProtein) {
        return `${input.name} is useful for muscle gain because it contributes meaningful protein per serving. Add carbs or fat around it depending on your energy needs.`;
      }
      if (isHigherCarb) {
        return `${input.name} is a convenient carb source for training performance. Pair it with a protein you enjoy to support muscle gain.`;
      }
      return `${input.name} can support muscle gain as part of a higher-calorie day. The key is pairing it with enough protein and total calories over time.`;
    })(),
    generalHealth: (() => {
      if (category === 'vegetable' || category === 'fruit') {
        return `${input.name} is an easy way to add more whole foods to your diet. Keep it visible and convenient so it actually shows up in your meals.`;
      }
      return `${input.name} can be part of a healthy diet when you balance it with vegetables, adequate protein, and overall calorie intake that matches your goals.`;
    })(),
  };

  const mealIdeasByCategory: Record<typeof category, string[]> = {
    protein: [
      `Build a simple bowl: ${nameLower} + rice or potatoes + a big handful of vegetables + a sauce you love.`,
      `Use it for meal prep: cook once, portion into containers, and rotate flavors (lemon herb, spicy, teriyaki-style).`,
      `Make a high-protein salad: add ${nameLower} to greens, tomatoes, cucumbers, and a measured dressing.`,
      `Add it to wraps or sandwiches with crunchy vegetables for volume without many extra calories.`,
      `Pair it with a higher-carb side on training days, and with extra vegetables on lower-activity days.`,
    ],
    grain: [
      `Use ${nameLower} as the base of a bowl with lean protein and vegetables for an easy calorie-controlled meal.`,
      `For better satiety, add a protein source and keep sauces measured; the base portion stays consistent.`,
      `Turn it into meal prep: cook a batch, then build different bowls across the week to avoid repetition.`,
      `Mix it into soups or stir-fries to make meals more filling without relying on snacks later.`,
      `Use smaller servings on rest days and larger servings around workouts for performance.`,
    ],
    fruit: [
      `Use ${nameLower} as a snack with a protein (Greek yogurt, cottage cheese) to keep hunger steady.`,
      `Add it to oatmeal or smoothies when you need an easy carb source that still feels “whole food.”`,
      `Pre-portion it so you can log it quickly and avoid mindless snacking.`,
      `Pair it with nuts or nut butter in a measured amount for a more satisfying snack.`,
      `Use it as a sweet finish to meals if you are trying to reduce desserts. `,
    ],
    vegetable: [
      `Add ${nameLower} to most meals for volume. A bigger plate can make a calorie deficit feel easier.`,
      `Roast or sauté it with seasonings you enjoy so it is something you actually want to eat often.`,
      `Use it in meal prep: cook a batch and add it to bowls, salads, and wraps throughout the week.`,
      `Pair it with a protein you like, then adjust carbs and fats depending on your goals.`,
      `Use it as the “default side” so your meals stay consistent even when your schedule is busy.`,
    ],
    dairy: [
      `Use ${nameLower} as a quick protein anchor (especially at breakfast) and add fruit or oats for carbs.`,
      `If you track macros, pre-portion servings so your protein is predictable day to day.`,
      `Mix it into bowls with berries and a measured topping for a balanced snack or dessert.`,
      `Pair it with savory meals as a side, then adjust the rest of the plate based on calories.`,
      `Use it to raise protein without adding a lot of cooking time.`,
    ],
    fat: [
      `Use ${nameLower} in measured amounts to improve taste and adherence—just keep portions consistent.`,
      `Pair it with lean protein and high-volume vegetables for a satisfying, balanced plate.`,
      `Add it to meals you already eat so you do not change everything at once while cutting.`,
      `If fat loss is the goal, treat it like a “flavor budget” item: a little goes a long way.`,
      `Use it on higher-activity days when you can fit more calories comfortably.`,
    ],
    general: [
      `Keep portions consistent and pair ${nameLower} with vegetables and a protein for a balanced meal.`,
      `Use it in meal prep so you can repeat meals without repeating flavors.`,
      `Log it once in a calculator, then reuse the same serving to simplify daily tracking.`,
      `Try pairing it with different seasonings or sauces so it stays enjoyable.`,
      `Use smaller servings for weight loss and larger servings for muscle gain or higher-activity days.`,
    ],
  };

  const mealIdeas = pick(
    [
      mealIdeasByCategory[category],
      [mealIdeasByCategory[category][1], mealIdeasByCategory[category][0], mealIdeasByCategory[category][3], mealIdeasByCategory[category][2], mealIdeasByCategory[category][4]],
    ],
    seed + 31
  );

  return {
    intro: pick(intros, seed),
    flavorStyle,
    macroAngle,
    benefitBullets,
    bestFor,
    mealIdeas,
  };
}

export default async function FoodPage({ params }: Props) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) notFound();

  const { name, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g } = food;
  const portions = [50, 100, 150, 200] as const;
  const isHighProtein = proteinPer100g >= 15;
  const isLowCarb = carbsPer100g <= 5;
  const isModerateCal = caloriesPer100g <= 200;
  const copy = buildFoodCopy({ name, slug, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g });

  const canonicalUrl = `${SITE_URL}/foods/${slug}`;
  const nutritionSchema = {
    '@context': 'https://schema.org',
    '@type': 'NutritionInformation',
    name: `Nutrition facts for ${name} (per 100g)`,
    calories: `${caloriesPer100g} kcal`,
    proteinContent: `${proteinPer100g} g`,
    carbohydrateContent: `${carbsPer100g} g`,
    fatContent: `${fatPer100g} g`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Foods', item: `${SITE_URL}/foods` },
      { '@type': 'ListItem', position: 3, name, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(nutritionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-2xl">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol
              className="flex flex-wrap items-center gap-2 text-sm"
            >
              <li>
                <Link href="/" className="hover:text-[#85BEFF]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/foods" className="hover:text-[#85BEFF]">
                  Foods
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-500">{name}</li>
            </ol>
          </nav>

          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
          >
            Nutrition Facts for {name}
          </h1>

          {/* Added: richer unique content for SEO + usefulness */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              What Is {name}?
            </h2>
            <p className={pClass}>{copy.intro}</p>
            <p className={`${pClass} mt-4`}>{copy.flavorStyle}</p>
            <p className={`${pClass} mt-4`}>{copy.macroAngle}</p>
            <p className="mt-4 text-sm text-gray-500">
              Tip: If you are tracking intake, log portions using a realistic serving size (not just 100g) so your daily totals reflect what you actually eat.
            </p>
          </section>

          {/* Section 1: Calories in X (Per 100g) */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              Calories in {name} (Per 100g)
            </h2>
            <p className="mb-4 text-gray-600">
              The following values are standardized per 100 grams of {name.toLowerCase()}.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li className="rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-4 py-3">
                <span className="text-sm text-gray-500">Calories</span>
                <p className="text-xl font-semibold text-[#364052]">{caloriesPer100g} kcal</p>
              </li>
              <li className="rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-4 py-3">
                <span className="text-sm text-gray-500">Protein</span>
                <p className="text-xl font-semibold text-[#364052]">{proteinPer100g} g</p>
              </li>
              <li className="rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-4 py-3">
                <span className="text-sm text-gray-500">Carbohydrates</span>
                <p className="text-xl font-semibold text-[#364052]">{carbsPer100g} g</p>
              </li>
              <li className="rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] px-4 py-3">
                <span className="text-sm text-gray-500">Fat</span>
                <p className="text-xl font-semibold text-[#364052]">{fatPer100g} g</p>
              </li>
            </ul>
          </section>

          {/* Section 2: Nutrition by Serving Size */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              Nutrition by Serving Size
            </h2>
            <p className="mb-4 text-gray-600">
              Calories and macros for common portion sizes of {name.toLowerCase()}.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#E3ECF7]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E3ECF7] bg-[#F7FAFF]">
                    <th className="px-4 py-3 font-semibold text-[#364052]">Portion</th>
                    <th className="px-4 py-3 font-semibold text-[#364052]">Calories</th>
                    <th className="px-4 py-3 font-semibold text-[#364052]">Protein</th>
                    <th className="px-4 py-3 font-semibold text-[#364052]">Carbs</th>
                    <th className="px-4 py-3 font-semibold text-[#364052]">Fat</th>
                  </tr>
                </thead>
                <tbody>
                  {portions.map((g) => (
                    <tr key={g} className="border-b border-[#E3ECF7] last:border-0">
                      <td className="px-4 py-3 font-medium text-[#364052]">{g}g</td>
                      <td className="px-4 py-3 text-gray-600">
                        {scale(caloriesPer100g, g / 100)} kcal
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {scale(proteinPer100g, g / 100)} g
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {scale(carbsPer100g, g / 100)} g
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {scale(fatPer100g, g / 100)} g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Dynamic portion calculator (food pages only) */}
          <FoodPortionCalculator food={food} />

          {/* Section 3: Is X Good for Weight Loss? */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              Is {name} Good for Weight Loss?
            </h2>
            <p className={pClass}>
              {name} can fit into a weight loss diet when portions are controlled. At{' '}
              {caloriesPer100g} calories per 100g, it{' '}
              {isModerateCal
                ? 'offers a moderate calorie density, so you can include it in a calorie deficit without blowing your budget.'
                : 'is calorie-dense, so measuring portions helps keep intake in check.'}{' '}
              {isHighProtein &&
                `${name} is high in protein (${proteinPer100g}g per 100g), which supports satiety and helps preserve muscle during a deficit. `}
              {isLowCarb &&
                'It is low in carbs, making it easy to pair with vegetables and other foods. '}
              For best results, combine {name.toLowerCase()} with plenty of vegetables and a
              sustainable calorie target from a{' '}
              <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                calorie calculator
              </Link>{' '}
              or{' '}
              <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                calorie deficit calculator
              </Link>.
            </p>
          </section>

          {/* Added: Health benefits */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              Health Benefits of {name}
            </h2>
            <p className={pClass}>
              No single food is “magic,” but choosing foods that you can portion consistently (and actually enjoy) is a big part of sustainable fat loss and better health habits. Here are practical reasons {name.toLowerCase()} can be a useful addition to a balanced diet:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              {copy.benefitBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>

          {/* Added: Who it's best for */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              Who Is {name} Best For?
            </h2>
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5">
                <h3 className="mb-2 text-lg font-semibold text-[#364052]">Weight loss</h3>
                <p className={pClass}>{copy.bestFor.weightLoss}</p>
              </div>
              <div className="rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5">
                <h3 className="mb-2 text-lg font-semibold text-[#364052]">Muscle gain</h3>
                <p className={pClass}>{copy.bestFor.muscleGain}</p>
              </div>
              <div className="rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5">
                <h3 className="mb-2 text-lg font-semibold text-[#364052]">General health</h3>
                <p className={pClass}>{copy.bestFor.generalHealth}</p>
              </div>
            </div>
          </section>

          {/* Section 4: How to Use X in Your Diet */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              How to Use {name} in Your Diet
            </h2>
            <p className="mb-4 text-gray-600">
              Practical ways to include {name.toLowerCase()} in meals:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              {copy.mealIdeas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
              <li>
                Want a fast macro breakdown? Use the{' '}
                <Link href="/tools/meal-log-calculator" className="text-[#85BEFF] hover:underline">
                  Meal Log Calculator
                </Link>{' '}
                to estimate calories and macros for your full meal (not just one ingredient).
              </li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class}>
              Related Tools
            </h2>
            <p className={pClass}>
              Log {name.toLowerCase()} and other foods in the{' '}
              <Link href="/tools/meal-log-calculator" className="text-[#85BEFF] hover:underline">
                Meal Log Calculator
              </Link>
              . Set daily targets with the{' '}
              <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                calorie calculator
              </Link>{' '}
              and{' '}
              <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                macro calculator
              </Link>.
            </p>
          </section>

          {/* Related Products */}
          <section className={sectionClass}>
            <h2 className={h2Class}>
              Related Products
            </h2>
            <p className="mb-4 text-gray-600">
              Similar foods you might want to compare or add to your meals:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {getRelatedFoods(slug, 4).map((related) => (
                <Link
                  key={related.slug}
                  href={`/foods/${related.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-[#E3ECF7] bg-[#F7FAFF] p-3 transition-all hover:border-[#85BEFF] hover:shadow-md"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-lg"
                    aria-hidden
                  >
                    {related.emoji}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold text-[#364052] transition-colors group-hover:text-[#85BEFF]">
                      {related.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {related.caloriesPer100g} kcal · {related.proteinPer100g}g protein
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              <Link href="/foods" className="text-[#85BEFF] hover:underline">
                Browse all foods →
              </Link>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
