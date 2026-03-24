import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import IBWCalculator from '@/components/IBWCalculator';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ideal Body Weight Calculator | Healthy Range by Height',
  description:
    'Free ideal weight calculator using Devine and Robinson formulas: healthy range by height, frame size, and how your current weight compares — reference tool for goals, not medical advice.',
  path: '/tools/ideal-body-weight-calculator',
  keywords: [
    'ideal body weight calculator',
    'what is my ideal weight',
    'ideal weight by height',
    'healthy weight range',
    'ideal weight calculator male',
    'ideal weight calculator female',
    'how much should I weigh',
  ],
});

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function IdealBodyWeightCalculatorPage() {
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
              <li className="text-gray-500">Ideal Body Weight Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Ideal Body Weight Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Ideal body weight (IBW) is an estimate of a healthy weight for a given height and sex,
            often used in medicine for dosing and nutrition. This calculator uses the Devine and
            Robinson formulas, shows a healthy weight range, and lets you compare with your current
            weight.
          </p>

          <IBWCalculator />

          {/* SEO description */}
          <div className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10" style={{ fontFamily: 'var(--font-rubik), sans-serif' }}>
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is the Ideal Body Weight Calculator?
              </h2>
              <p className={pClass}>
                The ideal body weight calculator estimates a healthy weight for your height and sex
                using the Devine and Robinson formulas. It shows a single IBW value, a ±10%
                healthy range, and lets you compare with your current weight. Ideal body weight
                was originally used in medicine for dosing; it is now also used as one reference
                for weight goals. The calculator supports metric and imperial units.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does the Ideal Body Weight Calculator Work?
              </h2>
              <p className={pClass}>
                You enter your height (cm or feet and inches) and sex. The calculator converts
                to metric and applies the Devine formula (and optionally the Robinson formula)
                to get ideal body weight in kg. A ±10% range around that number is shown as a
                healthy weight range. If you enter your current weight, you can see how it
                compares to the range.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Use This Ideal Body Weight Calculator?
              </h2>
              <p className={pClass}>
                An ideal body weight calculator gives you a height-based reference for a healthy
                weight. It is useful for context when setting goals or when a clinician uses IBW
                for dosing. Use it alongside our{' '}
                <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">
                  BMI calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                for a fuller picture of weight and composition.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className={pClass}>
                Anyone curious about a height-based healthy weight range can use this ideal body
                weight calculator. It suits adults who want one number to compare with their
                current weight. Athletes and very muscular people may sit above IBW and still be
                healthy; the calculator is a guide, not a diagnosis. For calorie or nutrition
                targets, use our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What is Ideal Body Weight?
              </h2>
              <p className={pClass}>
                Ideal body weight (IBW) is a height- and sex-based estimate of a &quot;healthy&quot;
                weight. It was originally developed for drug dosing and clinical use, not as a
                personal goal. IBW formulas do not account for age, muscle mass, bone structure, or
                body fat, so they are rough guides. Many people are healthy above or below their
                calculated IBW.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How is IBW calculated?
              </h2>
              <p className={pClass}>
                IBW is calculated from height and sex using equations that were derived from
                population data. The two most common are the Devine formula (1974) and the Robinson
                formula (1983). Both give a single number in kilograms; a ±10% range around that
                number is often used as a &quot;healthy weight range&quot; for that height.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Devine formula explanation
              </h2>
              <p className={pClass}>
                The Devine formula is the most widely used in medical contexts. For men, ideal body
                weight (kg) = 50 + 0.9 × (height in cm − 152). For women, IBW (kg) = 45.5 + 0.9 ×
                (height in cm − 152). So for each centimeter above 152 cm, the ideal weight increases
                by 0.9 kg, with a different starting point for each sex. Heights below 152 cm are
                handled by the same formula (the result is lower).
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Is IBW accurate?
              </h2>
              <p className={pClass}>
                IBW is a simple estimate, not a precise measure of health. It was designed for
                clinical use (e.g. drug dosing), not for judging whether an individual is
                &quot;too heavy&quot; or &quot;too light.&quot; It ignores body composition, so a
                very muscular person can be &quot;over&quot; IBW and healthy, while someone with
                low muscle mass might be &quot;at&quot; IBW but carry more body fat than is
                ideal. Use IBW as one reference, alongside BMI, how you feel, and advice from your
                doctor.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Limitations of IBW
              </h2>
              <p className={pClass}>
                IBW does not consider age, ethnicity, muscle mass, bone density, or body fat
                distribution. It assumes a &quot;reference&quot; body shape and composition that
                does not apply to everyone. Athletes, older adults, and people with different
                body types may find that their healthy weight is outside the calculated range.
                For personalized targets, combine this tool with a <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">BMI calculator</Link>, a{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">calorie calculator</Link>, or guidance from a healthcare provider.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
