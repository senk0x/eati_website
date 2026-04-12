import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import EatiCTA from '@/components/EatiCTA';
import CalorieCalculator from '@/components/CalorieCalculator';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { ogToolPath, toolOgAlt } from '@/lib/og';
import { toolSerpAb } from '@/lib/tools-serp-ab';
import { SITE_URL, absoluteUrl, buildPageMetadata } from '@/lib/seo';

const canonical = absoluteUrl('/tools/calorie-calculator');

const serp = toolSerpAb('calorie-calculator');

export const metadata: Metadata = buildPageMetadata({
  title: serp.title,
  description: serp.description,
  path: '/tools/calorie-calculator',
  ogImagePath: ogToolPath('calorie-calculator'),
  ogImageAlt: toolOgAlt('calorie-calculator'),
  keywords: [
    'calorie calculator',
    'daily calorie goal',
    'weight loss calories',
    'calorie deficit',
    'calorie surplus',
    'BMR calculator',
    'TDEE',
  ],
});

const CALORIE_FAQS = [
  {
    question: 'How many calories should I eat to lose weight?',
    answer:
      'Your target depends on your TDEE (total daily energy expenditure). A safe approach is to eat 300–500 calories below your TDEE for gradual weight loss (about 0.5–1 lb per week). Use this calorie calculator to get your BMR and TDEE, then choose a weight loss goal to see your recommended daily calories.',
  },
  {
    question: 'Is the calorie calculator accurate?',
    answer:
      'The calculator uses the Mifflin–St Jeor equation for BMR, which is widely used and validated. Results are estimates; individual variation is normal. Use the number as a starting point and adjust based on your weight change and energy levels over 2–4 weeks.',
  },
  {
    question: 'What is TDEE?',
    answer:
      'TDEE (Total Daily Energy Expenditure) is the total number of calories you burn per day, including rest and activity. It is calculated by multiplying your BMR (basal metabolic rate) by an activity factor. This calorie calculator shows both your BMR and TDEE.',
  },
  {
    question: 'Can I use this calorie calculator for muscle gain?',
    answer:
      'Yes. Select "Gain weight" as your goal and the calculator will suggest a calorie surplus (e.g. 200–300 kcal above maintenance). Pair it with adequate protein using our protein calculator and macro calculator for best results.',
  },
];

export default function CalorieCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'Calorie Calculator', item: canonical },
    ],
  };
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calorie Calculator',
    description: 'Free daily calorie goal calculator for weight loss, maintenance, or gain. Uses BMR and TDEE.',
    url: canonical,
    applicationCategory: 'HealthApplication',
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
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
              <li className="text-gray-500">Calorie Calculator</li>
            </ol>
          </nav>

          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
          >
            Calorie Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
          >
            Get your daily calorie target based on your age, body size, activity, and goal. We use
            the Mifflin–St Jeor equation to estimate your BMR and TDEE, then adjust for maintaining,
            losing, or gaining weight.
          </p>

          <CalorieCalculator />
          <EatiCTA
            contextType="tool"
            topic="calorie calculator daily intake"
            placementId="tool/calorie-calculator"
            className="mt-8"
          />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
          >
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                What Is the Calorie Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The calorie calculator is a free tool that estimates your daily calorie target for
                weight maintenance, loss, or gain. It uses your age, sex, weight, height, and
                activity level to calculate your BMR (basal metabolic rate) and TDEE (total daily
                energy expenditure), then adjusts for your goal. You get one clear daily calorie
                number to aim for.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                How Does the Calorie Calculator Work?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The calculator uses the Mifflin–St Jeor equation to estimate how many calories your
                body burns at rest (BMR). It then multiplies that by an activity factor to get your
                TDEE — the calories you burn in a typical day. For weight loss it subtracts a
                deficit (e.g. 500 kcal/day); for gain it adds a surplus. All math is done in metric
                (kg, cm); imperial units are converted automatically.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Why Use This Calorie Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                A daily calorie goal is the foundation of any weight or nutrition plan. This calorie
                calculator gives you a single target so you can plan meals, track intake, and
                adjust. It is useful for fat loss (controlled deficit), muscle gain (surplus with
                enough protein), or maintenance. Pair it with our{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                for a full picture.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Who Should Use This Tool?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Anyone planning to lose weight, gain muscle, or eat at maintenance can use this
                calorie calculator. It suits beginners who need a starting number and people who
                want to double-check their targets. If you have a medical condition or are on
                medication that affects weight, use the result as a guide and consider talking to
                your doctor. For a safe deficit, combine with our{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Is This Calculation Accurate?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                BMR and TDEE formulas are estimates; individual variation is normal. The
                Mifflin–St Jeor equation is one of the most widely used and performs well for
                most adults. Your actual needs can be 10–15% higher or lower. Use the calorie
                calculator result as a starting point, then adjust based on how your weight and
                energy change over a few weeks.
              </p>
            </section>

            <SeoFaqSection faqs={CALORIE_FAQS} className="mb-10" />

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Related Tools
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Use the{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                to see your maintenance calories in detail, the{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to set protein goals, and the{' '}
                <Link href="/tools/calorie-burn-calculator" className="text-[#85BEFF] hover:underline">
                  calorie burn calculator
                </Link>{' '}
                to see how exercise affects your daily burn. Read our{' '}
                <Link href="/blog" className="text-[#85BEFF] hover:underline">
                  blog
                </Link>{' '}
                for guides on calorie deficits and weight loss.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
