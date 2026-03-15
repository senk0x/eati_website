import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import CalorieDeficitCalculator from '@/components/CalorieDeficitCalculator';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eati.app';
const canonical = `${siteUrl}/tools/calorie-deficit-calculator`;

export const metadata: Metadata = {
  title: 'Calorie Deficit Calculator | Safe Weight Loss Planning',
  description:
    'Calculate your calorie deficit for weight loss. Get your TDEE, choose a deficit (mild, standard, or aggressive), and see your target calories and estimated weekly loss.',
  keywords: [
    'calorie deficit calculator',
    'weight loss calculator',
    'calorie deficit',
    'TDEE',
    'weekly weight loss',
  ],
  alternates: { canonical },
  openGraph: {
    title: 'Calorie Deficit Calculator | Eati',
    description: 'Plan a safe calorie deficit. See your maintenance calories, target intake, and estimated weekly weight loss.',
    url: canonical,
    type: 'website',
  },
};

export default function CalorieDeficitCalculatorPage() {
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
              <li className="text-gray-500">Calorie Deficit Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Calorie Deficit Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            A calorie deficit means eating fewer calories than you burn. Your body then uses stored
            fat for energy, so you lose weight. This calculator finds your maintenance calories
            (TDEE), lets you pick a deficit level, and shows your daily target and estimated weekly
            fat loss so you can plan safely.
          </p>

          <CalorieDeficitCalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                What Is the Calorie Deficit Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The calorie deficit calculator helps you plan safe weight loss by showing your
                maintenance calories (TDEE), then subtracting a chosen deficit to give a daily
                calorie target and estimated weekly weight loss. A calorie deficit means eating
                fewer calories than you burn so your body uses stored fat for energy. This tool
                keeps the deficit within a safe range and shows what to expect on the scale.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                How Does the Calorie Deficit Calculator Work?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                You enter your stats (weight, height, age, sex, activity) and the calculator
                estimates your TDEE using the Mifflin–St Jeor equation. You then choose a deficit
                level (e.g. mild, standard, or aggressive). The tool subtracts that deficit from
                TDEE to get your target daily calories and estimates weekly fat loss (roughly 1 lb
                per 3500 kcal deficit, adjusted for the size of the deficit).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Why Use This Calorie Deficit Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Planning a calorie deficit with a calculator helps you avoid cutting too much or
                too little. Too large a deficit can harm energy and muscle; too small can slow
                progress. This calorie deficit calculator gives you a clear daily target and
                expected weekly loss. Pair it with our{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to preserve muscle and our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                for a single goal number.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Anyone planning to lose weight in a controlled way can use this calorie deficit
                calculator. It is for adults who want a target intake and a rough idea of weekly
                loss. If you have a medical condition, are on weight-affecting medication, or
                need a very low intake, use the result as a guide and consider talking to your
                doctor or dietitian.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Is This Calculation Accurate?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                TDEE and weekly loss are estimates. Actual weight change depends on adherence,
                water retention, and individual metabolism. The calorie deficit calculator uses
                standard formulas; your real deficit may need tuning after a few weeks. For total
                daily burn, use our{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>; for exercise burn, try the{' '}
                <Link href="/tools/calorie-burn-calculator" className="text-[#85BEFF] hover:underline">
                  calorie burn calculator
                </Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Related Tools
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Get your maintenance first with the{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>, then use this calorie deficit calculator to set your target. Add the{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to plan protein, carbs, and fat while in a deficit.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
