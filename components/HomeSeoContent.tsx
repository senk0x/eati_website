import Link from "next/link";
import { SeoFaqSection } from "@/components/SeoFaqSection";

const sectionClass = "mx-auto max-w-7xl px-4 sm:px-5 md:px-6";
const h2Class =
  "text-2xl font-bold tracking-tight text-[#364052] md:text-3xl";
const h3Class = "mt-8 text-xl font-semibold text-[#364052] md:text-2xl";
const pClass = "mt-4 text-base leading-relaxed text-gray-700 md:text-lg";
const linkClass = "font-medium text-[#85BEFF] underline-offset-2 hover:underline";

const HOME_FAQS = [
  {
    question: "What is Eati and how is it different from other calorie trackers?",
    answer:
      "Eati is an AI calorie tracker that lets you log food the way you actually talk: describe a meal in one sentence, snap a photo of your plate, scan a barcode, or use your voice. Instead of hunting through databases for every ingredient, you get fast estimates for calories and macros so you can stay consistent—whether your goal is fat loss, maintenance, or building muscle.",
  },
  {
    question: "Can an AI calorie tracker be accurate enough for weight loss?",
    answer:
      "No tracker is perfectly exact for every meal; even manual logging has error. Eati is built for speed and consistency—two habits that matter most for fat loss. Use your daily totals as a reliable guide, then adjust portions every few weeks based on your weight trend and energy. Pair the app with our free calorie calculator and TDEE calculator on this site to set realistic targets.",
  },
  {
    question: "Is Eati a meal planner or only a food log?",
    answer:
      "Eati shines as a meal log and macro tracker: you see everything you ate in one place, review daily calories and protein, and stay aware without obsessive detail. For planning ahead, many users repeat favorite meals or describe planned dinners in advance. You can also explore our foods database for high-protein, low-calorie ideas per 100g serving.",
  },
  {
    question: "Does Eati work for high-protein or macro-focused diets?",
    answer:
      "Yes. Each log breaks out calories, protein, carbs, and fats so you can prioritize protein on a cut or balance macros for performance. Combine the app with our macro goal calculator and protein calculator to set daily targets that match your training and fat-loss goals.",
  },
  {
    question: "What free tools does Eati offer on the website?",
    answer:
      "This site includes free, no-signup calculators: calorie goal, TDEE, macro targets, protein, BMI, body fat, calorie burn, water intake, ideal body weight, meal log estimates, and more. They complement the mobile app so you can plan targets on desktop and track day-to-day habits on your phone.",
  },
  {
    question: "Where can I download the Eati app?",
    answer:
      "Eati is available on the App Store for iPhone. Use the App Store button in the header or footer of this site to install the app and start logging meals with AI in seconds.",
  },
];

export default function HomeSeoContent() {
  return (
    <section
      className="border-t border-[#E3ECF7] bg-[#FAFCFF] py-12 md:py-16"
      aria-labelledby="seo-guide-heading"
    >
      <div className={`${sectionClass} space-y-4`}>
        <h2 id="seo-guide-heading" className={h2Class}>
          AI calorie tracker &amp; fat loss app: how Eati helps you eat smarter
        </h2>
        <p className={pClass}>
          Sticking to a calorie goal is less about perfection and more about showing up every day.
          <strong className="font-semibold text-[#364052]"> Eati</strong> is an{" "}
          <strong className="font-semibold text-[#364052]">AI calorie tracker</strong> designed for
          real life: log breakfast in a few words, capture lunch with a photo, or scan packaged snacks
          so your numbers stay up to date without turning every meal into a research project. If you
          are focused on <strong className="font-semibold text-[#364052]">fat loss</strong>, that
          consistency matters more than nailing every single gram.
        </p>
        <p className={pClass}>
          The app works as a <strong className="font-semibold text-[#364052]">macro tracker</strong>{" "}
          and daily nutrition dashboard. You see calories plus protein, carbs, and fats together, which
          makes it easier to spot whether you are under-eating protein or drifting over budget on
          casual snacks. Many people combine an AI-assisted log with a simple weekly check-in on the
          scale and adjust portions gradually—an approach that supports sustainable weight loss
          without extreme restriction.
        </p>

        <h3 className={h3Class}>How AI meal logging fits your routine</h3>
        <p className={pClass}>
          Traditional databases are powerful but slow when you are eating mixed meals or home cooking.
          With conversational logging, you describe a plate in natural language—similar to texting a
          friend—and get structured nutrition back. Photo logging helps when you do not know exact
          weights, and barcode scanning keeps packaged foods honest. Voice input is ideal when you are
          commuting or your hands are full. Together, these options reduce friction so the habit of
          tracking actually sticks.
        </p>
        <p className={pClass}>
          Think of Eati as a <strong className="font-semibold text-[#364052]">meal planner</strong>{" "}
          companion: even if you do not pre-plan every dish, you can review your day at a glance,
          notice patterns, and decide tomorrow&apos;s portions with clearer data. For deeper planning,
          browse our{" "}
          <Link href="/blog" className={linkClass}>
            nutrition and weight loss articles
          </Link>{" "}
          or open any free{" "}
          <Link href="/tools" className={linkClass}>
            calculator
          </Link>{" "}
          to set your energy and macro targets before you lean on the app for day-to-day logging.
        </p>

        <h3 className={h3Class}>Free calculators to pair with the app</h3>
        <p className={pClass}>
          Use our{" "}
          <Link href="/tools/calorie-calculator" className={linkClass}>
            calorie calculator
          </Link>{" "}
          and{" "}
          <Link href="/tools/tdee-calculator" className={linkClass}>
            TDEE calculator
          </Link>{" "}
          to estimate maintenance calories, then choose a modest deficit or surplus. The{" "}
          <Link href="/tools/macro-goal-calculator" className={linkClass}>
            macro goal calculator
          </Link>{" "}
          and{" "}
          <Link href="/tools/protein-calculator" className={linkClass}>
            protein calculator
          </Link>{" "}
          help you align protein with muscle retention during a cut. Tools like{" "}
          <Link href="/tools/bmi-calculator" className={linkClass}>
            BMI
          </Link>
          ,{" "}
          <Link href="/tools/body-fat-calculator" className={linkClass}>
            body fat
          </Link>
          , and{" "}
          <Link href="/tools/water-intake-calculator" className={linkClass}>
            water intake
          </Link>{" "}
          round out a practical toolkit for long-term health—not quick fixes.
        </p>
        <p className={pClass}>
          Ready to try the mobile experience? Download Eati on the{" "}
          <a
            href="https://apps.apple.com/app/apple-store/id6758241088?pt=127995771&ct=Official%20Website&mt=8"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            App Store
          </a>{" "}
          and start logging meals with AI in seconds. Questions or partnerships: visit our{" "}
          <Link href="/contact" className={linkClass}>
            contact page
          </Link>
          .
        </p>

        <SeoFaqSection
          faqs={HOME_FAQS}
          title="Frequently asked questions about Eati"
          className="mt-12 border-t border-[#E3ECF7] pt-10"
        />
      </div>
    </section>
  );
}
