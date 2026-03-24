import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BodyFatCalculator from '@/components/BodyFatCalculator';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Body Fat Calculator | Navy Method % & Lean Mass (Free)',
  description:
    'Free U.S. Navy body fat calculator: estimate body fat % from waist, neck, and height (hip for women). See fat mass and lean mass in kg or lbs — no photos required, private at home.',
  path: '/tools/body-fat-calculator',
  keywords: [
    'body fat calculator',
    'body fat percentage calculator',
    'how to calculate body fat',
    'body fat calculator navy method',
    'body fat by measurements',
    'lean body mass calculator',
    'calculate body fat at home',
    'body fat percentage formula',
  ],
});

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function BodyFatCalculatorPage() {
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
              <li className="text-gray-500">Body Fat Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Body Fat Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Body fat percentage is the share of your weight that comes from fat. This calculator
            uses the U.S. Navy body fat formula and your measurements (waist, neck, height, and
            hip for women) to estimate your body fat %, fat mass, and lean body mass. No photos,
            AI, or image analysis — formula-based only. Results are hidden until you run the
            calculation.
          </p>

          <BodyFatCalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is the Body Fat Calculator?
              </h2>
              <p className={pClass}>
                The body fat calculator estimates your body fat percentage from simple measurements
                using the U.S. Navy formula. You enter waist, neck, and height (and hip for
                women); no photos or AI. It returns body fat %, fat mass, and lean body mass in
                kg and lbs, plus a category (e.g. fitness, average). Body fat percentage reflects
                composition better than weight or BMI alone.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does the Body Fat Calculator Work?
              </h2>
              <p className={pClass}>
                The calculator uses the U.S. Navy body fat formula: for men, waist, neck, and
                height in cm are plugged into a standard equation; for women, hip is added. All
                measurements are converted to metric first. The formula outputs body fat %; fat
                mass is then weight × (body fat % ÷ 100), and lean mass is weight minus fat mass.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Use This Body Fat Calculator?
              </h2>
              <p className={pClass}>
                Tracking body fat percentage helps you see whether you are losing fat or muscle and
                set realistic goals. This body fat calculator works at home with a tape measure —
                no DEXA or calipers required. Use it with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                to plan intake while losing fat.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className={pClass}>
                Anyone who wants an estimate of body fat percentage from measurements can use this
                body fat calculator. It suits people tracking fat loss, athletes monitoring
                composition, and anyone curious about body fat without access to DEXA or other
                methods. For context, pair with our{' '}
                <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">
                  BMI calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/ideal-body-weight-calculator" className="text-[#85BEFF] hover:underline">
                  ideal body weight calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is Body Fat Percentage?
              </h2>
              <p className={pClass}>
                Body fat percentage is the proportion of your total body weight that is fat mass,
                as opposed to lean mass (muscle, bone, water, organs). Unlike BMI, which only uses
                height and weight, body fat % better reflects body composition. Two people can
                have the same BMI but very different body fat levels.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How to Calculate Body Fat
              </h2>
              <p className={pClass}>
                You can estimate body fat at home using measurement-based formulas (like the U.S.
                Navy method), skinfold calipers, or smart scales. This calculator uses the Navy
                formula: you enter waist, neck, and height in metric or imperial; women also
                enter hip. All values are converted to metric (cm, kg) and plugged into the
                formula. You get body fat %, then fat mass = weight × (body fat % / 100) and
                lean body mass = weight − fat mass. No photos or AI required.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                U.S. Navy Method Explained
              </h2>
              <p className={pClass}>
                The U.S. Navy body fat formula was developed to estimate body fat from a few
                circumference measurements. For men it uses waist, neck, and height (all in cm).
                For women it uses waist, hip, neck, and height. The formula is based on
                regression equations that relate these measurements to body density and then to
                body fat percentage. It is one of the most widely used “body fat by measurements”
                methods and works well for general population ranges. Measure waist at the
                navel, neck below the larynx, and hip at the widest part for consistent results.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Is the Navy Method Accurate?
              </h2>
              <p className={pClass}>
                The Navy method is a reasonable estimate for most people when measurements are
                taken consistently. It can be off by a few percentage points compared to
                DEXA or underwater weighing, and accuracy varies with body type and how you
                measure. Use it for tracking trends over time (same formula, same technique)
                rather than an absolute “true” number. For context on weight and height, pair
                with our{' '}
                <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">
                  BMI calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/ideal-body-weight-calculator" className="text-[#85BEFF] hover:underline">
                  ideal body weight calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Healthy Body Fat Ranges
              </h2>
              <p className={pClass}>
                Healthy body fat ranges differ by sex. For men, essential fat is about 2–5%,
                athletes often 6–13%, fitness 14–17%, average 18–24%, and obese 25%+. For
                women, essential is about 10–13%, athletes 14–20%, fitness 21–24%, average
                25–31%, and obese 32%+. The calculator shows which category your result falls
                into. These ranges are guidelines; individual goals depend on health, sport,
                and preference. Use the result to inform nutrition and training — for example
                with our{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How to Reduce Body Fat
              </h2>
              <p className={pClass}>
                To reduce body fat, most people need a modest calorie deficit (eating slightly
                less than they burn), enough protein to preserve muscle, and resistance
                training. Use our{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                to set a target intake, and the{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to hit a daily protein goal. Re-measure with this body fat calculator every few
                weeks to track progress; body fat % and lean body mass are more informative than
                scale weight alone.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
