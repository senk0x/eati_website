import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BodyFatAnalytics from '@/components/BodyFatAnalytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eati.app';
const canonical = `${siteUrl}/tools/body-fat-analytics`;

export const metadata: Metadata = {
  title:
    'Body Fat % Analytics | Estimate Body Fat From Photo | AI Body Fat Calculator',
  description:
    'Estimate body fat percentage from photos with AI. Upload front and side view for a visual body fat estimate. Body fat photo calculator and analyzer. For tracking only — not a substitute for professional testing.',
  keywords: [
    'body fat photo calculator',
    'body fat analyzer from photo',
    'estimate body fat from picture',
    'AI body fat calculator',
    'body fat percentage from image',
    'visual body fat estimator',
  ],
  alternates: { canonical },
  openGraph: {
    title: 'Body Fat % Analytics | AI Photo-Based Estimate | Eati',
    description:
      'Estimate body fat percentage from your photos. Upload front and side views for an AI-powered visual estimate.',
    url: canonical,
    type: 'website',
  },
};

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function BodyFatAnalyticsPage() {
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
              <li className="text-gray-500">Body Fat % Analytics</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Body Fat % Analytics
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Get an AI-based estimate of your body fat percentage from one or two photos. Upload a
            front view (required) and optionally a side view for better accuracy. The model analyzes
            visible body shape and indicators and returns an estimated percentage, confidence
            level, and category. Results are for general interest and tracking only — not a
            replacement for professional body composition testing.
          </p>

          <BodyFatAnalytics />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is Body Fat % Analytics?
              </h2>
              <p className={pClass}>
                Body Fat % Analytics is a photo-based tool that uses AI to estimate body fat
                percentage from uploaded images. You provide a front view (and optionally a side
                view); the system analyzes visible body shape and composition cues and returns an
                estimated percentage, confidence level, and category. It is designed for
                engagement and trend tracking, not as a medical or clinical body composition test.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does AI Estimate Body Fat From Photos?
              </h2>
              <p className={pClass}>
                The tool sends your photo(s) to an AI vision model that is prompted to look only
                at body shape, muscle definition, and fat distribution (e.g. abdomen, limbs). It
                does not identify individuals and does not comment on identity or appearance. The
                model returns a structured estimate (body fat %, confidence, category, and a short
                explanation of the visible indicators used). For a measurement-based approach
                without photos, use our{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                (U.S. Navy formula).
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Is Photo-Based Body Fat Accurate?
              </h2>
              <p className={pClass}>
                Photo-based body fat estimation is less accurate than DEXA, calipers, or other
                professional methods. Accuracy depends on lighting, angle, clothing, and image
                quality. This tool is best used for relative tracking over time (e.g. same setup
                each time) rather than an absolute number. Always treat it as an estimate. For
                daily nutrition and calorie targets, pair with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Advantages of AI Body Fat Estimation
              </h2>
              <p className={pClass}>
                Photo-based estimation requires no special equipment — just a phone or camera. You
                can track changes over time by taking new photos in similar conditions. It
                complements formula-based tools like our{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                (waist, neck, height) and fits into a broader fitness toolkit:{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>,{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>, and{' '}
                <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">
                  BMI calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Limitations of This Method
              </h2>
              <p className={pClass}>
                AI body fat from photos does not replace medical or professional body composition
                testing. Results can vary with lighting, pose, and clothing. The model may be off
                for very muscular or atypical body types. Do not use this tool for medical
                decisions or diagnosis. For a measurement-based estimate at home, use the Navy
                method on our body fat calculator page; for clinical accuracy, see a healthcare
                provider or use DEXA/calipers where available.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
