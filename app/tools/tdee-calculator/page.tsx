import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import TDEECalculator from '@/components/TDEECalculator';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'TDEE Calculator | Daily Calorie Burn & BMR (Free)',
  description:
    'Free TDEE calculator: total daily energy expenditure and BMR using Mifflin–St Jeor. Set calorie targets for fat loss, maintenance, or muscle gain — metric or imperial.',
  path: '/tools/tdee-calculator',
  keywords: [
    'TDEE calculator',
    'total daily energy expenditure',
    'BMR calculator',
    'Mifflin-St Jeor',
    'calorie calculator',
    'weight loss calories',
  ],
});

export default function TDEECalculatorPage() {
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
              <li className="text-gray-500">TDEE Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            TDEE Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Find your Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) using the
            Mifflin–St Jeor equation. Use the results to set calorie targets for weight maintenance,
            loss, or gain.
          </p>

          <TDEECalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                What Is the TDEE Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The TDEE calculator estimates your Total Daily Energy Expenditure — the number of
                calories you burn in a typical day, including rest and activity. It also shows your
                BMR (basal metabolic rate), the calories you burn at rest. Knowing your TDEE helps
                you set a calorie target for weight loss, maintenance, or gain.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                How Does the TDEE Calculator Work?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The calculator uses the Mifflin–St Jeor equation to compute BMR from your age, sex,
                weight, and height. It then multiplies BMR by an activity factor (sedentary to very
                active) to get TDEE. You can enter measurements in metric (kg, cm) or imperial (lbs,
                feet and inches); values are converted to metric for the formula.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Why Use This TDEE Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Your TDEE is the reference point for planning intake: eat less to lose weight, more
                to gain, or match it to maintain. This TDEE calculator gives you one number you can
                use with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                to set daily goals. It is useful for understanding how much you burn before
                changing how much you eat.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Anyone who wants to know their daily calorie burn — for weight loss, muscle gain,
                or maintenance — can use this TDEE calculator. It is aimed at adults in a normal
                range of body composition. Athletes and very active people may see slightly
                different results; use the activity level that best matches your typical week.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Is This Calculation Accurate?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                TDEE and BMR are estimates. The Mifflin–St Jeor equation is well validated for most
                adults, but your actual expenditure can vary with metabolism, NEAT, and accuracy of
                the activity factor. Use the result as a starting point and adjust based on your
                weight change over 2–4 weeks. For body composition context, try our{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">
                  BMI calculator
                </Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Related Tools
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                After you have your TDEE, use the{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                for a daily goal, the{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                for protein, carbs, and fat, and the{' '}
                <Link href="/tools/calorie-burn-calculator" className="text-[#85BEFF] hover:underline">
                  calorie burn calculator
                </Link>{' '}
                to see how exercise adds to your burn.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
