import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import FoodPortionCalculator from '@/components/FoodPortionCalculator';
import { getFoodBySlug, getAllFoodSlugs } from '@/lib/foods';

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const h3Class = 'mb-2 text-lg font-semibold md:text-xl';
const pClass = 'text-base leading-relaxed text-gray-600';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllFoodSlugs().map((slug) => ({ slug }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eatiapp.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) return { title: 'Food Not Found' };
  const name = food.name;
  const canonical = `${siteUrl}/foods/${slug}`;
  return {
    title: `Nutrition Facts for ${name} | Calories per 100g`,
    description: `${name} nutrition: ${food.caloriesPer100g} kcal per 100g, ${food.proteinPer100g}g protein, ${food.carbsPer100g}g carbs, ${food.fatPer100g}g fat. Calories in ${name}, serving sizes, and weight loss tips.`,
    keywords: [
      `${name.toLowerCase()} calories`,
      `calories in ${name.toLowerCase()}`,
      `${name.toLowerCase()} per 100g`,
      `nutrition facts for ${name.toLowerCase()}`,
      `${name.toLowerCase()} protein`,
      `is ${name.toLowerCase()} healthy`,
      `${name.toLowerCase()} for weight loss`,
    ],
    alternates: { canonical },
    openGraph: {
      title: `Nutrition Facts for ${name} | Eati`,
      description: `${name}: ${food.caloriesPer100g} kcal, ${food.proteinPer100g}g protein per 100g.`,
      url: canonical,
      type: 'website',
    },
  };
}

function scale(n: number, factor: number): number {
  return Math.round(n * factor * 10) / 10;
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

  const canonicalUrl = `${siteUrl}/foods/${slug}`;
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Meal Log Calculator', item: `${siteUrl}/tools/meal-log-calculator` },
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
              style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
            >
              <li>
                <Link href="/" className="hover:text-[#85BEFF]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/tools/meal-log-calculator" className="hover:text-[#85BEFF]">
                  Meal Log Calculator
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-500">{name}</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Nutrition Facts for {name}
          </h1>

          {/* Section 1: Calories in X (Per 100g) */}
          <section className={sectionClass}>
            <h2 className={h2Class} style={{ color: '#364052' }}>
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
            <h2 className={h2Class} style={{ color: '#364052' }}>
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
            <h2 className={h2Class} style={{ color: '#364052' }}>
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

          {/* Section 4: How to Use X in Your Diet */}
          <section className={sectionClass}>
            <h2 className={h2Class} style={{ color: '#364052' }}>
              How to Use {name} in Your Diet
            </h2>
            <p className="mb-4 text-gray-600">
              Practical ways to include {name.toLowerCase()} in meals:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Add a 100g portion to lunch or dinner and pair with vegetables and a carb source if needed.</li>
              <li>Use in meal prep: cook in bulk and divide into portions for the week.</li>
              <li>Log your portion in our{' '}
                <Link href="/tools/meal-log-calculator" className="text-[#85BEFF] hover:underline">
                  Meal Log Calculator
                </Link>{' '}
                to see how it contributes to daily calories and macros.
              </li>
              <li>Combine with other high-protein or high-fiber foods to improve satiety.</li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className={h2Class} style={{ color: '#364052' }}>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
