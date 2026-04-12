import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import EatiCTA from '@/components/EatiCTA';
import BMICalculator from '@/components/BMICalculator';
import { SeoFaqSection } from '@/components/SeoFaqSection';
import { ogToolPath, toolOgAlt } from '@/lib/og';
import { SITE_URL, absoluteUrl, buildPageMetadata } from '@/lib/seo';

const canonical = absoluteUrl('/tools/bmi-calculator');

export const metadata: Metadata = buildPageMetadata({
  title: 'BMI Calculator | Know Your Index & Category',
  description:
    'Height and weight in—your BMI and a plain-English category appear on the spot, metric or imperial. Stays private in your browser. No signup.',
  path: '/tools/bmi-calculator',
  ogImagePath: ogToolPath('bmi-calculator'),
  ogImageAlt: toolOgAlt('bmi-calculator'),
  keywords: ['BMI calculator', 'body mass index', 'BMI', 'weight height calculator'],
});

const BMI_FAQS = [
  {
    question: 'What is a good BMI?',
    answer:
      'For adults, a BMI between 18.5 and 24.9 is generally considered normal. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is obesity. BMI is a screening tool and does not account for muscle mass or body composition.',
  },
  {
    question: 'How is BMI calculated?',
    answer:
      'BMI = weight (kg) ÷ height (m)². You can use metric (kg, cm) or imperial (lbs, feet and inches); this calculator converts to metric and gives your BMI and category.',
  },
  {
    question: 'Is BMI accurate for athletes?',
    answer:
      'BMI does not distinguish muscle from fat. Athletes with high muscle mass may have a high BMI despite low body fat. For body composition, use our body fat calculator or body fat analyzer.',
  },
  {
    question: 'What is the BMI range for obesity?',
    answer:
      'A BMI of 30 or above is classified as obesity (Class 1: 30–34.9, Class 2: 35–39.9, Class 3: 40+). BMI is a screening tool; discuss your health goals with a doctor.',
  },
];

export default function BMICalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'BMI Calculator', item: canonical },
    ],
  };
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BMI Calculator',
    description: 'Free Body Mass Index calculator. Get your BMI and category in metric or imperial units.',
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
              <li className="text-gray-500">BMI Calculator</li>
            </ol>
          </nav>

          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
          >
            BMI Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
          >
            Body Mass Index (BMI) is a number based on your weight and height. It is used as a
            simple screening tool to place adults into broad categories (underweight, normal weight,
            overweight, obesity). BMI does not measure body fat directly and does not account for
            muscle mass, age, or sex.
          </p>

          <BMICalculator />
          <EatiCTA
            contextType="tool"
            topic="BMI calculator body mass index"
            placementId="tool/bmi-calculator"
            className="mt-8"
          />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
          >
            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                What Is the BMI Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The BMI calculator computes your Body Mass Index from your weight and height. BMI
                is a simple screening number used to place adults into broad categories:
                underweight, normal weight, overweight, and obesity. It does not measure body fat
                directly but is widely used in health and research as a quick weight-for-height
                indicator.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                How Does the BMI Calculator Work?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The formula is BMI = weight (kg) ÷ height (m)². You enter your weight and height in
                metric (kg, cm) or imperial (lbs, feet and inches); the calculator converts to
                metric and gives your BMI plus the category (e.g. normal, overweight). No age or
                sex is used in the standard BMI formula.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Why Use This BMI Calculator?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                A BMI calculator gives you a fast way to see where you sit on the standard
                weight-for-height scale. It is useful for general awareness and for comparing
                with health guidelines. For a better picture of body composition, pair it with our{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/ideal-body-weight-calculator" className="text-[#85BEFF] hover:underline">
                  ideal body weight calculator
                </Link>. For calorie and weight goals, use our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Who Should Use This Tool?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Adults who want a quick weight-for-height check can use this BMI calculator. It is
                intended for general screening, not as a sole measure of health. Athletes and
                very muscular people may have a high BMI despite low body fat; older adults or
                those with low muscle mass may have a &quot;normal&quot; BMI but carry more fat.
                Use BMI as one reference alongside other tools and professional advice.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Is This Calculation Accurate?
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                The BMI formula is accurate as a math result; the number itself is correct for
                your weight and height. What varies is how well BMI reflects health or body fat
                for each person. It does not account for muscle mass, bone density, age, or sex.
                For body composition, consider our{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>; for daily nutrition, use the{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>.
              </p>
            </section>

            <SeoFaqSection faqs={BMI_FAQS} className="mb-10" />

            <section className="mb-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Related Tools
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                After checking your BMI, explore the{' '}
                <Link href="/tools/ideal-body-weight-calculator" className="text-[#85BEFF] hover:underline">
                  ideal body weight calculator
                </Link>{' '}
                for a height-based weight range, the{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                for composition, and the{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                for daily intake goals. More in our{' '}
                <Link href="/blog" className="text-[#85BEFF] hover:underline">
                  blog
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
