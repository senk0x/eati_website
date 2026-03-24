import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import CalorieBurnCalculator from '@/components/CalorieBurnCalculator';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Calorie Burn Calculator | MET Exercise & Activity Estimates',
  description:
    'Free calories burned calculator using MET values: walking, running, cycling, weights, and more. Enter weight and duration — kcal, kJ, and fat-loss context. No sign-up on Eati.',
  path: '/tools/calorie-burn-calculator',
  keywords: [
    'calorie burn calculator',
    'calories burned calculator',
    'how many calories do I burn',
    'calories burned by activity',
    'calorie calculator for exercise',
    'calories burned per hour',
    'weight loss calorie burn',
    'exercise calorie calculator',
  ],
});

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function CalorieBurnCalculatorPage() {
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
              <li className="text-gray-500">Calorie Burn Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Calorie Burn Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Calories are burned when your body uses energy for movement and metabolism. This
            calculator estimates how many calories you burn during a specific activity using
            MET values: enter your weight, choose an activity type, and duration. You get total
            kcal, kJ, calories per hour, and an optional fat-loss equivalent. Results are
            hidden until you run the calculation.
          </p>

          <CalorieBurnCalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is the Calorie Burn Calculator?
              </h2>
              <p className={pClass}>
                The calorie burn calculator estimates how many calories you burn during a specific
                activity based on your weight, the type of exercise, and duration. It uses MET
                (metabolic equivalent of task) values — a standard way to compare energy cost of
                different activities. You get total kcal, kJ, calories per hour, and an optional
                fat-loss equivalent. No sign-up or external data required.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does the Calorie Burn Calculator Work?
              </h2>
              <p className={pClass}>
                You enter your weight (metric or imperial), choose an activity from the list
                (e.g. walking, running, cycling, strength training), and duration in minutes. The
                calculator converts weight to kg and applies the formula: calories = MET ×
                weight (kg) × duration (hours). Each activity has a fixed MET value; duration
                is converted from minutes to hours for the calculation.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Use This Calorie Burn Calculator?
              </h2>
              <p className={pClass}>
                Knowing how many calories you burn per workout helps you plan intake, create a
                deficit, or fuel properly. This calorie burn calculator gives you a clear number
                for each session and per hour so you can compare activities. Use it with our{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                to see how exercise fits your daily budget.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className={pClass}>
                Anyone who wants to estimate calories burned by activity can use this calorie
                burn calculator — from casual exercisers to regular gym-goers. It is useful for
                weight loss planning (how much to eat vs. burn), comparing exercises, and
                understanding hourly burn rates. Pair it with our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                for full nutrition and training planning.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Are Calories Burned?
              </h2>
              <p className={pClass}>
                Your body burns calories all day for basic functions (breathing, circulation,
                digestion) and for activity. The more intense and longer the activity, the more
                energy you use. Exercise calorie burn depends on your body weight, the type and
                intensity of the activity, and duration. This calculator uses MET (metabolic
                equivalent of task) values to estimate energy expenditure. To see your total
                daily burn, use our{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>; for a daily calorie target, try our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is a MET Value?
              </h2>
              <p className={pClass}>
                MET stands for metabolic equivalent of task. One MET is the energy cost of
                sitting at rest. An activity with 4 METs uses about four times that energy.
                MET values are standardized so you can compare activities: for example, brisk
                walking is around 4 METs and running is 8–11 METs depending on speed. The
                formula used here is: calories burned = MET × weight (kg) × duration (hours).
                So heavier people burn more calories for the same activity and time, and
                higher MET activities burn more per minute.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Calories Burned by Activity
              </h2>
              <p className={pClass}>
                Different activities have different MET values. Light walking is around 2.5
                METs, brisk walking 4, moderate running 8, fast running 11, cycling about 7.5,
                strength training 6, swimming 8, and HIIT around 9. The calculator includes these
                and shows calories burned for your weight and duration. You also see calories
                per 30 minutes and per hour so you can plan workouts. Combine with our{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                to see how exercise contributes to weight loss.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Accurate Is This Calculator?
              </h2>
              <p className={pClass}>
                MET-based estimates are reasonable for most people but can vary with fitness,
                form, and environment. They are best for comparing activities and planning
                rather than an exact count. Actual burn can be 10–20% higher or lower. Use the
                result as a guide and track progress over time. For overall daily energy needs,
                the{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/body-fat-calculator" className="text-[#85BEFF] hover:underline">
                  body fat calculator
                </Link>{' '}
                help you understand composition and total expenditure.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Exercise Helps Weight Loss
              </h2>
              <p className={pClass}>
                Exercise increases the calories you burn and can create or enlarge a calorie
                deficit when combined with diet. It also helps preserve muscle and improve
                health. The calculator’s “fat loss equivalent” (calories ÷ 7700) is a rough
                guide: 1 kg of body fat is about 7700 kcal, so burning 7700 kcal through
                exercise could theoretically match 1 kg fat loss if diet stays the same. In
                practice, weight change depends on total intake and expenditure. Use our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                to set intake and protect muscle while losing fat.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Best Exercises for Burning Calories
              </h2>
              <p className={pClass}>
                Higher MET activities burn more calories per minute: running, HIIT, swimming,
                and cycling are among the highest. The best exercise for you is one you can
                do consistently and enjoy. Mix cardio and strength training — strength
                training builds muscle and can raise resting metabolism. Use this calorie burn
                calculator to compare activities and see how duration affects total burn, then
                pair with your{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/calorie-deficit-calculator" className="text-[#85BEFF] hover:underline">
                  calorie deficit calculator
                </Link>{' '}
                for a full plan.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
