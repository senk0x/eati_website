import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import MacroGoalCalculator from '@/components/MacroGoalCalculator';
import { ogToolPath, toolOgAlt } from '@/lib/og';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Macro Calculator | Gram Targets From Your TDEE',
  description:
    'Enter TDEE and goal—get protein, carb, and fat grams for cutting, maintaining, or bulking. Tweak inputs and watch targets update; no guesswork. No account.',
  path: '/tools/macro-goal-calculator',
  ogImagePath: ogToolPath('macro-goal-calculator'),
  ogImageAlt: toolOgAlt('macro-goal-calculator'),
  keywords: [
    'macro calculator',
    'protein calculator',
    'macro goals',
    'macronutrient calculator',
    'protein carbs fat',
  ],
});

export default function MacroGoalCalculatorPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-2xl">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol
              className="flex items-center gap-2 text-sm"
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
              <li className="text-gray-500">Macro Goal Calculator</li>
            </ol>
          </nav>

          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
          >
            Macro Goal Calculator
          </h1>
          <p
            className="mb-6 text-base text-gray-600 md:text-lg"
          >
            Macros (macronutrients) are the nutrients that supply calories: protein, carbohydrates,
            and fats. Protein and carbs provide 4 kcal per gram; fat provides 9 kcal per gram. This
            calculator gives you daily targets for each based on your body size, activity, and goal.
          </p>

          <MacroGoalCalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
          >
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                What Is the Macro Goal Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The macro goal calculator is a free tool that sets daily targets for protein,
                carbohydrates, and fat based on your body size, activity, and goal. Macros are the
                nutrients that supply calories: protein and carbs have 4 kcal per gram, fat has 9.
                This calculator gives you grams per day and optional calorie splits so you can plan
                meals and track intake.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                How Does the Macro Goal Calculator Work?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                You enter your weight, activity level, and goal (fat loss, maintenance, or muscle
                gain). The calculator estimates your daily calories (or uses your input) and
                allocates a share to protein (grams per kg body weight), then splits the
                remaining calories between carbs and fat using evidence-based ratios. You see
                daily grams for each macro and how they add up to your calorie target.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Why Use This Macro Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Hitting the right macros supports muscle retention during a cut, muscle gain in a
                surplus, and steady energy. This macro calculator turns a calorie goal into
                concrete protein, carb, and fat targets. Use it with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to align intake with your goals.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Who Should Use This Tool?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Anyone who wants to plan protein, carbs, and fat — for fat loss, maintenance, or
                muscle gain — can use this macro goal calculator. It suits people who already have
                a calorie target and want to break it into macros, and those who want one tool to
                set both calories and macros. Combine with the{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                for a full nutrition plan.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Is This Calculation Accurate?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Macro targets are based on common evidence-based ranges (e.g. protein by body
                weight and goal). Individual needs can vary. Use the macro calculator output as a
                starting point and adjust based on energy, performance, and results. For exercise
                context, try our{' '}
                <Link href="/tools/calorie-burn-calculator" className="text-[#85BEFF] hover:underline">
                  calorie burn calculator
                </Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Related Tools
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Set your calorie target first with the{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>, then use this macro calculator for protein, carbs, and fat. For weight
                loss planning, add the{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
