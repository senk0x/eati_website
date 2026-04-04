import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { FOODS } from '@/lib/foods';
import { OG_FOODS_INDEX_ALT, OG_FOODS_INDEX_PATH } from '@/lib/og';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Food Calories & Macros Database | High-Protein Foods List',
  description:
    'Browse calories, protein, carbs, and fat per 100g for 40+ foods — chicken, rice, eggs, salmon, and more. Handy for meal planning, macro tracking, and fat loss on Eati.',
  path: '/foods',
  ogImagePath: OG_FOODS_INDEX_PATH,
  ogImageAlt: OG_FOODS_INDEX_ALT,
  keywords: [
    'food nutrition database',
    'calories per 100g',
    'food calorie list',
    'nutrition facts',
    'protein foods',
    'macros database',
    'food calories chart',
  ],
});

export default function FoodsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-5xl">
          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            Food Nutrition Database
          </h1>
          <p
            className="mb-10 max-w-2xl text-base text-gray-600 md:text-lg"
          >
            Browse calories, protein, carbs, and fat for common foods. Click any food to see
            detailed nutrition facts, serving sizes, and tips for your diet.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FOODS.map((food) => (
              <Link
                key={food.slug}
                href={`/foods/${food.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-[#E3ECF7] bg-white p-4 transition-all hover:border-[#85BEFF] hover:shadow-lg md:rounded-3xl"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E7F0FF] text-2xl transition-colors group-hover:bg-[#85BEFF]/20"
                  aria-hidden
                >
                  {food.emoji}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h2
                    className="truncate text-base font-semibold transition-colors group-hover:text-[#85BEFF] md:text-lg"
                  >
                    {food.name}
                  </h2>
                  <p
                    className="text-sm text-gray-500"
                  >
                    {food.caloriesPer100g} kcal · {food.proteinPer100g}g protein
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Link to tools */}
          <div className="mt-12 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 text-center md:rounded-3xl">
            <p
              className="mb-4 text-base text-gray-700 md:text-lg"
            >
              Track your meals and hit your calorie goals with our free tools.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/tools/meal-log-calculator"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#364052] bg-[#364052] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#364052]"
              >
                Meal Log Calculator
              </Link>
              <Link
                href="/tools/calorie-calculator"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#E3ECF7] bg-white px-5 py-2.5 text-sm font-semibold text-[#364052] transition-all hover:border-[#85BEFF] hover:text-[#85BEFF]"
              >
                Calorie Calculator
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#E3ECF7] bg-white px-5 py-2.5 text-sm font-semibold text-[#364052] transition-all hover:border-[#85BEFF] hover:text-[#85BEFF]"
              >
                All Tools
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
