import Image from "next/image";

const BADGES = [
  {
    id: "weight-loss",
    title: "N. 1 tool",
    subtitle: "To Lose Weight",
  },
  {
    id: "app-store-rating",
    title: "5 ★",
    subtitle: "on App Store",
  },
] as const;

function StatBadge({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="stats-badge flex shrink-0 flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
      <div
        className="relative shrink-0 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44"
        aria-hidden
      >
        <Image
          src="/images/laurel.svg"
          alt="Decorative laurel wreath"
          width={176}
          height={176}
          className="stats-laurel h-full w-full object-contain"
          sizes="(max-width: 640px) 72px, (max-width: 1024px) 112px, 176px"
        />
      </div>

      <div className="stats-badge__text flex shrink-0 flex-col items-center text-center">
        <span
          id={`${id}-title`}
          className="stats-badge__title font-eati-heading text-eati-stats block whitespace-nowrap font-bold leading-tight"
        >
          {title}
        </span>
        <span className="stats-badge__subtitle font-eati-heading text-eati-stats block whitespace-nowrap font-normal leading-tight">
          {subtitle}
        </span>
      </div>

      <div
        className="relative shrink-0 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44 [transform:scaleX(-1)]"
        aria-hidden
      >
        <Image
          src="/images/laurel.svg"
          alt="Decorative laurel wreath"
          width={176}
          height={176}
          className="stats-laurel h-full w-full object-contain"
          sizes="(max-width: 640px) 72px, (max-width: 1024px) 112px, 176px"
        />
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-8" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Eati social proof and App Store rating
      </h2>
      <div className="mx-auto max-w-7xl overflow-visible">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12 lg:gap-16">
          {BADGES.map((badge) => (
            <StatBadge
              key={badge.id}
              id={badge.id}
              title={badge.title}
              subtitle={badge.subtitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
