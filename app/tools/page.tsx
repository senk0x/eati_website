import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eatiapp.com';
const canonical = `${siteUrl}/tools`;

export const metadata: Metadata = {
  title: 'Fitness & Weight Loss Tools | Free Calculators',
  description:
    'Free fitness and weight loss tools: calorie goal calculator, TDEE calculator, macro calculator, BMI calculator, body fat analyzer, and meal log calculator. Plan your nutrition with Eati.',
  keywords: [
    'calorie calculator',
    'TDEE calculator',
    'macro calculator',
    'BMI calculator',
    'body fat calculator',
    'meal log calculator',
    'weight loss tools',
    'fitness calculators',
  ],
  alternates: { canonical },
  openGraph: {
    title: 'Fitness & Weight Loss Tools | Eati',
    description:
      'Free calorie, TDEE, macro, BMI, and body fat tools. Plan your nutrition and reach your goals.',
    url: canonical,
    type: 'website',
  },
};

const TOOLS = [
  {
    name: 'Calorie Goal Calculator',
    description:
      'Find your daily calorie target for weight loss, maintenance, or muscle gain based on your goals and activity level.',
    icon: '🔥',
    href: '/tools/calorie-calculator',
  },
  {
    name: 'TDEE Calculator',
    description:
      'Calculate your Total Daily Energy Expenditure to see how many calories you burn each day.',
    icon: '📊',
    href: '/tools/tdee-calculator',
  },
  {
    name: 'Macro Goal Calculator',
    description:
      'Set your ideal protein, carbs, and fat targets to support your fitness and weight goals.',
    icon: '🥗',
    href: '/tools/macro-goal-calculator',
  },
  {
    name: 'Water Intake Calculator',
    description:
      'Find how much water you should drink per day by weight, activity, and climate. Results in ml, liters, and oz.',
    icon: '💧',
    href: '/tools/water-intake-calculator',
  },
  {
    name: 'Protein Calculator',
    description:
      'Find your daily protein intake by weight and goal. Protein for muscle gain, weight loss, and general health.',
    icon: '🥩',
    href: '/tools/protein-calculator',
  },
  {
    name: 'Body Fat Calculator',
    description:
      'Estimate body fat percentage with the U.S. Navy formula. Waist, neck, height (and hip for women). Fat mass and lean body mass.',
    icon: '📐',
    href: '/tools/body-fat-calculator',
  },
  {
    name: 'BMI Calculator',
    description:
      'Check your Body Mass Index and understand what it means for your health and weight range.',
    icon: '📏',
    href: '/tools/bmi-calculator',
  },
  {
    name: 'Calorie Burn Calculator',
    description:
      'Estimate calories burned by activity. MET-based formula for walking, running, cycling, and more. Calories per hour and fat loss equivalent.',
    icon: '🏃',
    href: '/tools/calorie-burn-calculator',
  },
  {
    name: 'Calorie Deficit Calculator',
    description:
      'Find your TDEE, choose a deficit level, and see your target calories and estimated weekly weight loss.',
    icon: '📉',
    href: '/tools/calorie-deficit-calculator',
  },
  {
    name: 'Ideal Body Weight Calculator',
    description:
      'Find your ideal weight by height using Devine and Robinson formulas. Healthy weight range and frame size.',
    icon: '⚖️',
    href: '/tools/ideal-body-weight-calculator',
  },
  {
    name: 'Body Fat % Analyzer (Photo)',
    description:
      'Estimate your body fat percentage using photo-based analysis for tracking progress over time.',
    icon: '📷',
    href: '/tools/body-fat-analytics',
  },
  {
    name: 'Meal Log Calculator',
    description:
      'Quickly tally calories and macros for your meals to stay on track with your daily goals.',
    icon: '📝',
    href: '/tools/meal-log-calculator',
  },
] as const;

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-5xl">
          <h1
            className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Fitness & Weight Loss Tools
          </h1>
          <p
            className="mb-10 max-w-2xl text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Free calculators and tools to plan your nutrition, track your progress, and reach your
            weight and fitness goals. More tools coming soon.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3ECF7] bg-white transition-all hover:border-[#85BEFF] hover:shadow-lg md:rounded-3xl"
              >
                <div
                  className="flex h-28 items-center justify-center bg-[#E7F0FF] transition-colors group-hover:bg-[#85BEFF]/20"
                  aria-hidden
                >
                  <span className="text-5xl md:text-6xl" role="img" aria-hidden>
                    {tool.icon}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2
                    className="mb-2 text-lg font-semibold transition-colors group-hover:text-[#85BEFF] md:text-xl"
                    style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
                  >
                    {tool.name}
                  </h2>
                  <p
                    className="text-sm leading-relaxed text-gray-600"
                    style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                  >
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
