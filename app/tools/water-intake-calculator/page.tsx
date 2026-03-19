import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import WaterIntakeCalculator from '@/components/WaterIntakeCalculator';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eatiapp.com';
const canonical = `${siteUrl}/tools/water-intake-calculator`;

export const metadata: Metadata = {
  title:
    'Water Intake Calculator | Daily Water Intake by Weight | Hydration Calculator',
  description:
    'Free water intake calculator. Find how much water you should drink per day by weight, activity, and climate. Daily water intake in ml, liters, and oz. Hydration calculator for health and fitness.',
  keywords: [
    'water intake calculator',
    'how much water should I drink',
    'daily water intake',
    'how much water per day',
    'hydration calculator',
    'water intake by weight',
    'how much water to drink to lose weight',
    'water calculator per day',
  ],
  alternates: { canonical },
  openGraph: {
    title: 'Water Intake Calculator | Eati',
    description:
      'Calculate your daily water intake by weight, activity level, and climate. Results in ml, liters, and oz.',
    url: canonical,
    type: 'website',
  },
};

const sectionClass = 'mb-10';
const h2Class = 'mb-3 text-xl font-semibold md:text-2xl';
const pClass = 'text-base leading-relaxed text-gray-600';

export default function WaterIntakeCalculatorPage() {
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
              <li className="text-gray-500">Water Intake Calculator</li>
            </ol>
          </nav>

          <h1
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Water Intake Calculator
          </h1>
          <p
            className="mb-8 text-base text-gray-600 md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            Staying hydrated supports energy, digestion, and recovery. This calculator estimates your
            daily water need in milliliters, liters, and ounces based on your weight, activity
            level, and climate. Results are hidden until you run the calculation.
          </p>

          <WaterIntakeCalculator />

          {/* SEO description */}
          <div
            className="mt-16 space-y-10 border-t border-[#E3ECF7] pt-10"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                What Is the Water Intake Calculator?
              </h2>
              <p className={pClass}>
                The water intake calculator is a free tool that estimates how much fluid you
                should drink per day based on your weight, activity level, and climate. It gives
                results in milliliters, liters, and ounces so you can track hydration easily. The
                calculator uses a base of 35 ml per kg of body weight, then adds extra for
                activity and hot conditions.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Does the Water Intake Calculator Work?
              </h2>
              <p className={pClass}>
                You enter your weight (metric or imperial), activity level (sedentary to
                athlete), and optional climate (normal or hot). The calculator converts everything
                to metric, multiplies weight in kg by 35 for the base requirement, then adds
                activity and climate bonuses. You get one daily target in ml, L, and oz.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Use This Water Intake Calculator?
              </h2>
              <p className={pClass}>
                Staying hydrated supports energy, focus, digestion, and recovery. This water intake
                calculator gives you a clear daily target instead of guessing. It is useful for
                general health, athletes who sweat more, and anyone in hot weather. Pair it with
                our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                for full nutrition planning.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Who Should Use This Tool?
              </h2>
              <p className={pClass}>
                Anyone who wants a daily fluid target can use this water intake calculator —
                from sedentary adults to active individuals and athletes. It is especially helpful
                if you are unsure how much to drink or train in heat. If you have kidney or heart
                conditions, use the result as a guide and follow any limits your doctor recommends.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Why Hydration Is Important
              </h2>
              <p className={pClass}>
                Water is essential for almost every body function: it helps regulate temperature,
                transport nutrients, remove waste, cushion joints, and keep skin and organs healthy.
                Even mild dehydration can affect mood, focus, and physical performance. Getting
                enough fluid each day supports energy levels, digestion, and recovery from exercise.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                How Much Water Do You Need Per Day?
              </h2>
              <p className={pClass}>
                General guidelines often suggest around 2–3 liters (about 8–12 cups) per day for
                adults, but needs vary with body size, activity, and environment. A common
                rule of thumb is about 35 ml of water per kg of body weight as a base, then add
                more for exercise and hot weather. Use the water intake calculator above to get a
                personalized daily target in ml, liters, and ounces.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Water Intake by Body Weight
              </h2>
              <p className={pClass}>
                Heavier people generally need more fluid than lighter people because total body
                water scales with mass. The calculator uses your weight (in kg or converted from
                lbs) and multiplies by 35 ml per kg to get a base daily amount. You can enter
                weight in kilograms (metric) or pounds (imperial); all math is done in metric
                for consistency. Pair this with our{' '}
                <Link href="/tools/bmi-calculator" className="text-[#85BEFF] hover:underline">
                  BMI calculator
                </Link>{' '}
                or{' '}
                <Link href="/tools/ideal-body-weight-calculator" className="text-[#85BEFF] hover:underline">
                  ideal body weight calculator
                </Link>{' '}
                to understand your weight in context.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Does Exercise Increase Water Needs?
              </h2>
              <p className={pClass}>
                Yes. Sweat losses during exercise increase your fluid needs. The calculator adds
                extra water based on activity level: from sedentary (no extra) to light, moderate,
                heavy training, or athlete (up to 1000 ml extra). Hot or humid conditions add
                another 500 ml. Drink before, during, and after workouts to stay hydrated. For
                calorie and macro targets around training, use our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Signs of Dehydration
              </h2>
              <p className={pClass}>
                Common signs include thirst, dark urine, dry mouth, fatigue, dizziness, and
                headache. In hot weather or after exercise, these can appear quickly. Drinking
                regularly throughout the day and increasing intake when active or in heat helps
                prevent dehydration. If you are unsure how much to drink, use the hydration
                calculator above and aim to meet your daily target.
              </p>
            </section>

            <section className={sectionClass}>
              <h2 className={h2Class} style={{ color: '#364052' }}>
                Can You Drink Too Much Water?
              </h2>
              <p className={pClass}>
                For most people, drinking to thirst and meeting a reasonable daily target (e.g.
                from this calculator) is safe. Extremely high intakes in a short time can rarely
                cause hyponatremia (low sodium), especially during long endurance events. Spread
                your intake across the day rather than drinking huge amounts at once. If you have
                kidney or heart conditions, your doctor may recommend specific fluid limits. For
                general health and fitness, the amounts from this water intake calculator are a
                sensible starting point. Combine with our{' '}
                <Link href="/tools/protein-calculator" className="text-[#85BEFF] hover:underline">
                  protein calculator
                </Link>{' '}
                and{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>{' '}
                to plan full nutrition and energy needs.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
