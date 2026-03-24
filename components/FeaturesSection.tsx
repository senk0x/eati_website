import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section
      className="px-4 py-8 sm:px-5 md:px-6 md:py-12"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
        <h2 id="features-heading" className="sr-only">
          Eati app features: AI meal logging, photo scan, barcode, voice, and progress
        </h2>
        {/* Feature 1 - Log meals: text then image on all screens */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Text block - always first on mobile */}
          <div className="order-1 w-full flex-1 md:pr-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              Log meals like chatting
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Simply describe what you ate in natural language — like &ldquo;chicken breast with
              spaghetti&rdquo; or &ldquo;oatmeal 80g with banana&rdquo; — and our AI instantly
              calculates calories, protein, carbs, 
              and fats. No more searching through databases or scanning barcodes.
            </p>
          </div>

          {/* Image - second on mobile */}
          <div
            className="order-2 flex flex-1 items-start justify-center overflow-hidden rounded-[2rem] pb-6 md:rounded-[3rem] md:pb-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#95E3A1" }}
          >
            <div className="relative w-full max-w-[320px]">
              <Image
                src="/images/feature-chat.png"
                alt="Eati AI calorie tracker: chat-style meal log showing high-protein food and macro totals"
                width={400}
                height={600}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>
          </div>
        </div>

        {/* Feature 2 - See your day: text above image on mobile */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          {/* Image - second on mobile, first (left) on md */}
          <div
            className="order-2 flex flex-1 items-end justify-center overflow-hidden rounded-[2rem] pt-6 md:order-1 md:rounded-[3rem] md:pt-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#F9DF74" }}
          >
            <div className="relative w-full max-w-[360px]">
              <Image
                src="/images/feature-history.png"
                alt="Daily nutrition summary in Eati: calories and macros for weight loss tracking"
                width={480}
                height={520}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 480px"
              />
            </div>
          </div>

          {/* Text - first on mobile, second (right) on md */}
          <div className="order-1 flex-1 md:order-2 md:pl-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              See your day
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Tap on the nutrition banner to open a clean daily summary of everything you&apos;ve eaten.
              All meals are grouped in one place so you can quickly review calories, protein, carbs, and
              fats for the whole day without scrolling through a long log.
            </p>
          </div>
        </div>

        {/* Feature 3 - Voice log: text then image */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="order-1 flex-1 md:pr-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              Log with your voice
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Say what you ate and get instant nutrition — tap the microphone, speak your meal, and
              the AI transcribes and calculates calories and macros. Perfect when your hands are full
              or you&apos;re on the go.
            </p>
          </div>

          {/* Image - second on mobile */}
          <div
            className="order-2 flex flex-1 items-start justify-center overflow-hidden rounded-[2rem] pb-6 md:rounded-[3rem] md:pb-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#E097EA" }}
          >
            <div className="relative w-full max-w-[320px]">
              <Image
                src="/images/feature-voice.png"
                alt="Voice meal logging in the Eati fat loss app: speak meals for instant calorie estimates"
                width={400}
                height={600}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>
          </div>
        </div>

        {/* Feature 4 - Scan & analyze: text above image on mobile */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div
            className="order-2 flex flex-1 items-end justify-center overflow-hidden rounded-[2rem] md:order-1 md:rounded-[3rem] min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#F97477" }}
          >
            <div className="relative w-full">
              <Image
                src="/images/feature-scan.png"
                alt="Photo-based meal scan: AI estimates portions and calories for home-cooked and restaurant plates"
                width={560}
                height={420}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          </div>

          {/* Text - first on mobile */}
          <div className="order-1 flex-1 md:order-2 md:pl-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              Scan & analyze
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Take a photo of your plate and get instant nutrition — the AI recognizes dishes, estimates
              portions, and calculates calories, protein, carbs, and fats. No typing required.
            </p>
          </div>
        </div>

        {/* Feature 5 - Barcode: text then image */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="order-1 flex-1 md:pr-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              Scan barcodes
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Scan any packaged product&apos;s barcode and instantly get accurate nutrition info. 
              The app pulls data from a global database so you can log snacks, drinks, and groceries 
              in seconds without manual entry.
            </p>
          </div>

          {/* Image - second on mobile */}
          <div
            className="order-2 flex flex-1 items-end justify-center overflow-hidden rounded-[2rem] pt-6 md:rounded-[3rem] md:pt-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#74B5F9" }}
          >
            <div className="relative w-full">
              <Image
                src="/images/feature-barcode.png"
                alt="Barcode scanner for packaged snacks and groceries — quick accurate calories for macro tracking"
                width={560}
                height={420}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          </div>
        </div>

        {/* Feature 6 - Track progress: text above image on mobile */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div
            className="order-2 flex flex-1 items-center justify-center overflow-hidden rounded-[2rem] py-6 md:order-1 md:rounded-[3rem] md:py-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#F99C74" }}
          >
            <div className="relative w-full max-w-[320px]">
              <Image
                src="/images/feature-progress.png"
                alt="Weight and body progress charts in Eati for long-term fat loss and habit building"
                width={400}
                height={600}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>
          </div>

          {/* Text - first on mobile */}
          <div className="order-1 flex-1 md:order-2 md:pl-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              Track progress
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Log weight and body measurements over time and see your progress in clear charts. Set goals,
              track trends, and stay motivated as you build better eating and fitness habits.
            </p>
          </div>
        </div>

        {/* Feature 7 - Stay motivated: text then image */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="order-1 flex-1 md:pr-4">
            <h3
              className="text-3xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#364052" }}
            >
              Stay motivated
            </h3>
            <p
              className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg"
              style={{ fontFamily: "var(--font-rubik), sans-serif", color: "#364052" }}
            >
              Enable optional home-screen widgets and gentle reminders to keep your nutrition on track. 
              Get motivational banners, streak notifications, and daily prompts that help you build 
              lasting healthy habits.
            </p>
          </div>

          {/* Image - second on mobile */}
          <div
            className="order-2 flex flex-1 items-center justify-center overflow-hidden rounded-[2rem] py-6 md:rounded-[3rem] md:py-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#9374F9" }}
          >
            <div className="relative w-full max-w-[320px]">
              <Image
                src="/images/feature-notifications.png"
                alt="Widgets and reminders in Eati: gentle nudges to stay on track with nutrition goals"
                width={400}
                height={600}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 90vw, 400px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
