import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ProteinCalculator from '@/components/ProteinCalculator';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eati.app';
const canonical = `${siteUrl}/tools/protein-calculator`;

export const metadata: Metadata = {
  title: 'Protein Calculator | How Much Protein Do I Need Per Day',
  description:
    'Free protein calculator. Find your daily protein intake by weight and goal. Protein for muscle gain, weight loss, and general health. Grams per day and per meal.',
  keywords: [
    'protein calculator',
    'how much protein do I need',
    'daily protein intake',
    'protein intake per day',
    'protein calculator by weight',
    'how much protein to build muscle',
    'protein for weight loss',
    'grams of protein per day',
  ],
  alternates: { canonical },
  openGraph: {
    title: 'Protein Calculator | Eati',
    description: 'Calculate your daily protein needs by weight and goal. Muscle gain, fat loss, and general health.',
    url: canonical,
    type: 'website',
  },
};

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function ProteinCalculatorPage() {
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
              <li className="text-gray-500">Protein Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Protein Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Protein supports muscle repair, satiety, and many body functions. This calculator gives
            you a daily protein target in grams based on your weight and goal, plus per-meal guidance
            and a healthy range so you can plan your intake.
          </p>

          <ProteinCalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is the Protein Calculator?
              </h2>
              <p className={pClass}>
                The protein calculator is a free tool that gives you a daily protein target in
                grams based on your weight and goal (e.g. general health, light activity, muscle
                gain, or fat loss). It also shows a healthy range, per-meal suggestions, and how
                your target fits common guidelines. Protein is essential for muscle repair, satiety,
                and many body functions; this calculator helps you plan intake without guesswork.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does the Protein Calculator Work?
              </h2>
              <p className={pClass}>
                You enter your weight (metric or imperial) and choose a goal from sedentary
                through muscle gain or fat loss. Each goal uses a grams-per-kg multiplier (e.g.
                1.6 g/kg for moderate training). The calculator converts weight to kg if needed,
                multiplies by the multiplier, and shows your daily grams plus a range and per-meal
                split for 3 or 4 meals.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Use This Protein Calculator?
              </h2>
              <p className={pClass}>
                Hitting the right protein intake supports muscle preservation during a cut, muscle
                gain in a surplus, and fullness. This protein calculator turns evidence-based
                ranges into one number and per-meal targets. Use it with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                to align protein with total calories and carbs/fat.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className={pClass}>
                Anyone who wants a daily protein target — for general health, muscle gain, or fat
                loss — can use this protein calculator. It suits beginners who need a starting
                number and people who want to check their current intake. If you have kidney
                disease or other conditions, use the result as a guide and follow your doctor’s
                advice.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How much protein do you need?
              </h2>
              <p className={pClass}>
                Needs depend on body weight, activity, and goals. A common range is 1.2–2.2 g per kg
                of body weight per day: sedentary adults may do fine at the lower end (around 0.8–1.2
                g/kg), while people who are training hard or in a fat-loss phase often aim for
                1.6–2.2 g/kg. This calculator uses your weight and goal to suggest a daily target
                and a range.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Protein for muscle gain
              </h2>
              <p className={pClass}>
                To support muscle growth, research suggests roughly 1.6–2.2 g of protein per kg of
                body weight per day when combined with resistance training and enough calories.
                Spreading intake across 3–4 meals with 20–40 g per meal can help maximize muscle
                protein synthesis. Use our <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">macro calculator</Link> or{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">calorie calculator</Link> to pair protein with the right total calories.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Protein for weight loss
              </h2>
              <p className={pClass}>
                During a calorie deficit, higher protein (e.g. 1.6–2.2 g/kg) can help preserve
                muscle, keep you full, and support recovery. Many people aim for the upper end of
                the range when cutting. Combine with the <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">calorie deficit calculator</Link> and{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">TDEE calculator</Link> to set your overall intake.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Is too much protein bad?
              </h2>
              <p className={pClass}>
                For most healthy people, intakes up to 2–2.2 g/kg are well tolerated and do not harm
                kidneys or bones. Very high intakes (well above 3 g/kg long term) are not necessary
                for most and may displace other nutrients. If you have kidney disease or other
                conditions, talk to your doctor. For general and athletic populations, the ranges
                from this calculator are considered safe and effective.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
