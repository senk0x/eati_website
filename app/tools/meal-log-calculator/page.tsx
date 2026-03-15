import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import MealLogCalculator from '@/components/MealLogCalculator';
import { getFrequentlySearchedFoods } from '@/lib/foods';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eati.app';
const canonical = `${siteUrl}/tools/meal-log-calculator`;

export const metadata: Metadata = {
  title:
    'Meal Log Calculator | Calorie Tracker for Meals | AI Food Calorie Calculator',
  description:
    'Log meals and get instant calories and macros. Free meal calorie calculator and calorie tracker. Enter foods and amounts; AI estimates total calories, protein, carbs, and fat. Nutrition calculator online.',
  keywords: [
    'meal calorie calculator',
    'calorie tracker for meals',
    'food calorie calculator',
    'calculate calories from food',
    'AI calorie calculator',
    'macro calculator from meals',
    'nutrition calculator online',
    'log meals and calories',
  ],
  alternates: { canonical },
  openGraph: {
    title: 'Meal Log Calculator | Eati',
    description:
      'Log your meals and get AI-estimated calories and macros. Free meal calorie calculator.',
    url: canonical,
    type: 'website',
  },
};

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function MealLogCalculatorPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-2xl">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol
              className="flex items-center gap-2 text-sm"
              style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
            >
              <li>
                <Link href="/" className="hover:text-[#85BEFF]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/tools" className="hover:text-[#85BEFF]">
                  Tools
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-500">Meal Log Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Meal Log Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Enter one or more foods and the amount you had (e.g. grams, ml, pieces, servings).
            AI estimates total calories and macros (protein, carbs, fat) for your meal. Add
            multiple items, edit or remove them, then hit calculate. Results are hidden until
            calculation is done.
          </p>

          <MealLogCalculator />

          {/* Frequently Searched Foods */}
          <section
            className="mt-10 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:rounded-3xl md:p-8"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
              Frequently Searched Foods
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Quick links to nutrition facts (calories and macros per 100g) for popular foods.
              Use these in your meal planning or log them in the calculator above.
            </p>
            <ul className="flex flex-wrap gap-2">
              {getFrequentlySearchedFoods().map((food) => (
                <li key={food.slug}>
                  <Link
                    href={`/foods/${food.slug}`}
                    className="inline-block rounded-full border border-[#D5E3F5] bg-white px-4 py-2 text-sm font-medium text-[#364052] transition-colors hover:border-[#85BEFF] hover:text-[#85BEFF]"
                  >
                    {food.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is the Meal Log Calculator?
              </h2>
              <p className={pClass}>
                The meal log calculator is a free tool that lets you enter foods and amounts and
                get an AI-estimated total of calories and macros (protein, carbs, fat). You can
                add multiple items per meal, use flexible descriptions (e.g. &quot;chicken breast
                grilled 200g&quot;, &quot;rice cooked 150g&quot;, &quot;2 eggs&quot;), and see a
                per-item breakdown. It is designed for quick logging and general tracking, not as
                a substitute for professional dietetics.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does the AI Calculate Calories?
              </h2>
              <p className={pClass}>
                When you submit your meal list, it is sent to an AI model that interprets food
                names and quantities and estimates nutritional values from a broad knowledge of
                typical foods and portions. The same system powers our main nutrition assistant.
                It returns calories and macros per item and totals. Use clear descriptions and
                amounts (e.g. &quot;salmon 150g&quot;, &quot;broccoli 100g&quot;) for better
                estimates. Pair this with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                to compare your meal to your daily goal.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Accurate Is This Tool?
              </h2>
              <p className={pClass}>
                Values are AI-based estimates and can vary with preparation, brand, and portion
                accuracy. They are best used for general tracking and trend awareness rather than
                exact medical or dietetic use. For personalized targets, use our{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                to set daily goals, then log meals here to see how each meal fits.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Tracking Meals Is Important
              </h2>
              <p className={pClass}>
                Logging what you eat helps you see patterns, hit calorie and macro targets, and
                stay accountable. A meal log calculator makes it easy to get quick totals without
                manual lookup. Combine it with a daily calorie goal from our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                for weight loss, or with the{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to meet protein targets.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How This Tool Helps With Weight Loss
              </h2>
              <p className={pClass}>
                Knowing the calories and macros of your meals helps you stay within a deficit or
                maintenance target. Use this meal log calculator to tally a single meal or a full
                day of entries, then compare to your goal. For a structured plan, set your
                target with the calorie deficit calculator and macro calculator, then log
                regularly here to track progress and adjust as needed.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
