import Image from "next/image";

export default function StatsSection() {
  return (
    <section className="px-4 py-4 sm:px-5 sm:py-6 md:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Mobile: row with laurels flanking text (like photo 2); laurels half size. Desktop: unchanged */}
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 md:gap-8 lg:gap-12">
          {/* Left laurel - 3x smaller; wrapper controls size (Next/Image width/height can override class) */}
          <div className="relative order-1 flex shrink-0 items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
            <Image
              src="/images/laurel.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* Centered text */}
          <div className="flex flex-col items-center text-center order-2">
            <span
              className="block text-xl font-normal leading-tight sm:text-2xl md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#343A40" }}
            >
              N. 1 tool
            </span>
            <span
              className="block text-lg font-normal leading-tight sm:text-xl md:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-bowlby-one), sans-serif", color: "#343A40" }}
            >
              To Lose Weight
            </span>
          </div>

          {/* Right laurel - 3x smaller, mirrored */}
          <div className="relative order-3 flex shrink-0 items-center justify-center w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 [transform:scaleX(-1)]">
            <Image
              src="/images/laurel.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
