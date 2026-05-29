import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section
      className="px-4 py-8 sm:px-5 md:px-6 md:py-12"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
        <h2 id="features-heading" className="sr-only">
          Eati app features: data logging, personalized AI nutrition approach, progress, and motivation
        </h2>

        {/* Feature 1 - Log your data */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="order-1 w-full flex-1 md:pr-4">
            <h3 className="font-eati-heading text-3xl md:text-4xl lg:text-5xl">
              Log your data
            </h3>
            <p className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg">
              Log meals, activity, and body progress in seconds with the Eati AI calorie tracker and macro
              tracker. Type naturally, speak with voice input, or use camera-based logging to capture real
              life data fast and keep daily nutrition, training, and progress history in one place.
            </p>
          </div>

          <div
            className="order-2 flex w-full flex-1 items-start justify-center overflow-visible rounded-[2rem] pb-6 md:rounded-[3rem] md:pb-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#95E3A1" }}
          >
            <div className="relative w-full max-w-[560px] aspect-[580/418] overflow-visible">
              <Image
                src="/images/logbg.svg"
                alt="Eati logging interface background with fixed phone frame"
                fill
                className="object-contain"
                loading="lazy"
                sizes="(max-width: 768px) 92vw, 560px"
              />
              <div className="feature-log-messages">
                <div className="feature-log-message-slot feature-log-message-slot-1">
                  <Image
                    src="/images/logmess1.svg"
                    alt="Meal logging card with macro breakdown"
                    width={397}
                    height={219}
                    className="feature-log-frame feature-log-frame-1 is-first h-auto w-full"
                    loading="lazy"
                    sizes="(max-width: 768px) 65vw, 397px"
                  />
                </div>
                <div className="feature-log-message-slot feature-log-message-slot-2">
                  <Image
                    src="/images/logmess2.svg"
                    alt="Activity logging card with calories burned"
                    width={392}
                    height={187}
                    className="feature-log-frame feature-log-frame-2 h-auto w-full"
                    loading="lazy"
                    sizes="(max-width: 768px) 64vw, 392px"
                  />
                </div>
                <div
                  className="feature-log-message-slot feature-log-message-slot-3"
                  style={{ top: "1.5%", width: "71%" }}
                >
                  <Image
                    src="/images/logmess3.svg"
                    alt="Photo-based meal logging card with nutrition estimate"
                    width={437}
                    height={269}
                    className="feature-log-frame feature-log-frame-3 h-auto w-full"
                    loading="lazy"
                    sizes="(max-width: 768px) 72vw, 437px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2 - Get Personalized Approach */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div
            className="order-2 flex w-full flex-1 items-end justify-center overflow-hidden rounded-[2rem] pt-6 md:order-1 md:rounded-[3rem] md:pt-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#F9DF74" }}
          >
            <div className="relative w-full max-w-[560px]">
              <Image
                src="/images/approach.svg"
                alt="Personalized AI nutrition approach with custom meal plans, advice, and recommendations"
                width={580}
                height={418}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 92vw, 560px"
              />
            </div>
          </div>

          <div className="order-1 flex-1 md:order-2 md:pl-4">
            <h3 className="font-eati-heading text-3xl md:text-4xl lg:text-5xl">
              Get Personalized Approach
            </h3>
            <p className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg">
              Based on your logs, Eati builds a personalized meal plan, gives practical nutrition advice,
              answers your food and fitness questions, and recommends relevant recipes and exercises. This
              creates a realistic fat loss or muscle gain strategy tailored to your routine.
            </p>
          </div>
        </div>

        {/* Feature 3 - Get Better */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="order-1 flex-1 md:pr-4">
            <h3 className="font-eati-heading text-3xl md:text-4xl lg:text-5xl">
              Get Better
            </h3>
            <p className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg">
              The app helps you move toward any body goal, from weight loss to lean muscle gain, as fast
              and safely as your plan allows. Track trends, adjust nutrition and activity with clear data,
              and improve consistency without extreme restrictions.
            </p>
          </div>

          <div
            className="order-2 flex w-full flex-1 items-start justify-center overflow-hidden rounded-[2rem] pb-6 md:rounded-[3rem] md:pb-8 min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#E097EA" }}
          >
            <div className="relative w-full max-w-[560px]">
              <Image
                src="/images/progress.svg"
                alt="Progress tracking for weight loss and muscle gain with actionable nutrition and training data"
                width={580}
                height={418}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 92vw, 560px"
              />
            </div>
          </div>
        </div>

        {/* Feature 4 - Stay motivated */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div
            className="order-2 flex w-full flex-1 items-end justify-center overflow-hidden rounded-[2rem] md:order-1 md:rounded-[3rem] min-h-[210px] md:min-h-[260px]"
            style={{ backgroundColor: "#97DFEA" }}
          >
            <div className="relative w-full max-w-[560px]">
              <Image
                src="/images/motivation.svg"
                alt="Smart reminders, home widgets, and gamification that keep healthy habits consistent"
                width={580}
                height={418}
                className="h-auto w-full"
                loading="lazy"
                sizes="(max-width: 768px) 92vw, 560px"
              />
            </div>
          </div>

          <div className="order-1 flex-1 md:order-2 md:pl-4">
            <h3 className="font-eati-heading text-3xl md:text-4xl lg:text-5xl">
              STAY MOTIVATED!
            </h3>
            <p className="mt-4 text-base leading-relaxed md:mt-6 md:text-lg">
              Keep momentum with smart notifications, home-screen widgets, streaks, and light gamification
              that reward consistency. Eati helps you maintain healthy habits even on busy days, so your
              results keep moving forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
