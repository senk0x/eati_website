"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6758241088?pt=127995771&ct=Official%20Website&mt=8";

export default function StartNowSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const revealClass = () =>
    `transition-all duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
      isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
    }`;

  return (
    <section className="px-4 py-6 sm:px-5 md:px-6 md:py-8" aria-labelledby="start-now-heading">
      <h2 id="start-now-heading" className="sr-only">
        Start your fitness journey now with Eati
      </h2>

      <div
        ref={sectionRef}
        className="relative mx-auto flex min-h-[220px] max-w-7xl flex-col overflow-hidden rounded-[2rem] sm:min-h-[240px] md:min-h-[280px] md:rounded-[3rem]"
        style={{
          background: "linear-gradient(180deg, #7CF1CA 0%, #EFCD44 100%)",
        }}
      >
        <Image
          src="/images/Frame 101569.svg"
          alt=""
          width={1129}
          height={280}
          aria-hidden
          className="h-full w-full object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1129px"
        />

        <div className="relative z-10 flex h-full flex-col items-center px-4 pb-0 pt-5 md:px-6 md:pt-7">
          <div className="inline-flex flex-col items-center">
            <a
              href={APP_STORE_URL}
              data-eati-app-store="start_now_section"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0A0B10] px-5 py-2.5 text-center text-lg font-semibold leading-tight text-white shadow-[0_8px_20px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_12px_28px_rgba(0,0,0,0.28)] active:scale-[0.98] sm:px-7 sm:py-3 sm:text-xl md:px-8 md:text-2xl ${revealClass()}`}
            >
              Start Your Fitness Journey Now
            </a>

            <div
              className={`mt-2 flex items-center gap-1.5 self-start pl-0.5 sm:pl-1 md:mt-2.5 md:-translate-x-3 ${revealClass()}`}
              style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
            >
              <span
                className="text-sm text-white sm:text-base md:text-lg"
                style={{ fontFamily: '"Bradley Hand", "Bradley Hand ITC", system-ui, cursive' }}
              >
                100% free
              </span>
              <svg
                width="24"
                height="16"
                viewBox="0 0 40 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
                aria-hidden
              >
                <path
                  d="M1 25.226C1.10578 25.226 6.07004 25.2066 13.9963 24.9068C22.6289 24.5802 28.6451 14.1941 30.3959 10.9453C32.5729 6.90562 30.5965 2.21943 30.1591 1.61038C27.8975 -1.53881 36.5963 8.43345 38.0393 9.84418C41.7756 13.4968 31.3038 4.23091 29.5275 1.63126C27.9081 -0.738732 25.1974 7.01808 23.6929 8.21484C24.3529 7.72213 26.3956 6.50953 28.6159 5.37676C29.7011 4.75967 30.702 4.05683 31.7763 3.01213"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div
            className={`mt-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] ${revealClass()}`}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <Image
              src="/images/afds.svg"
              alt="Eati mascot celebration illustration"
              width={780}
              height={474}
              className="mx-auto h-auto w-full object-contain object-bottom"
              sizes="(max-width: 768px) 72vw, 420px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
