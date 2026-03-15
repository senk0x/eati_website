import Image from "next/image";

const reviews = [
  {
    name: "Maya",
    flag: "🇺🇸",
    progress: "176 lbs → 158 lbs in 2 months",
    comment:
      "So easy to just type what I ate and get the numbers. No more guessing — I dropped 18 lbs and actually enjoyed the process.",
    bgColor: "#FFF6E6",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
  },
  {
    name: "James",
    flag: "🇦🇺",
    progress: "220 lbs → 198 lbs in 3 months",
    comment:
      "Finally an app that doesn't make logging feel like homework. Down 22 lbs and my doctor said my numbers look better than they have in years.",
    bgColor: "#E7F0FF",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  },
  {
    name: "Claire",
    flag: "🇫🇷",
    progress: "143 lbs → 128 lbs in 6 weeks",
    comment:
      "The chat-style logging is a game changer. I hit my goal in under two months and never felt restricted — just aware.",
    bgColor: "#FFE6E0",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face",
  },
];

export default function ReviewsSection() {
  return (
    <section className="px-4 py-8 sm:px-5 md:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <h2
          className="mb-8 text-center text-2xl font-bold text-gray-900 md:mb-12 md:text-3xl"
          style={{ fontFamily: "var(--font-rubik), sans-serif" }}
        >
          What our users are saying
        </h2>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-[2rem] p-6 text-center md:rounded-[2.5rem] md:p-8"
              style={{
                backgroundColor: review.bgColor,
                fontFamily: "var(--font-rubik), sans-serif",
              }}
            >
              {/* Avatar */}
              <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full md:h-20 md:w-20">
                <Image
                  src={review.avatar}
                  alt=""
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name and flag */}
              <div className="mb-1 flex items-center justify-center gap-2">
                <span className="text-lg font-bold text-gray-900 md:text-xl">
                  {review.name}
                </span>
                <span className="text-xl leading-none" aria-hidden>
                  {review.flag}
                </span>
              </div>

              {/* Progress */}
              <p className="mb-4 text-sm text-gray-600">{review.progress}</p>

              {/* Comment */}
              <p className="text-left text-sm leading-relaxed text-gray-800 md:text-base">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
