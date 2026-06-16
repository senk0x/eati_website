"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import GreetingMascotIcon from "@/components/GreetingMascotIcon";
import { eatiAppStoreUrl } from "@/lib/seo";

const PHONE_SRC = "/images/Frame 101641.svg";
const ROTATE_MS = 4500;

type MessageFrameConfig = {
  src: string;
  top: string;
  left: string;
  width: string;
  maxWidth: string;
};

const MESSAGE_FRAMES: MessageFrameConfig[] = [
  {
    src: "/images/messages/Frame 101642.svg",
    top: "33%",
    left: "50%",
    width: "108%",
    maxWidth: "20rem",
  },
  {
    src: "/images/messages/Frame 101644.svg",
    top: "34%",
    left: "46%",
    width: "96%",
    maxWidth: "17rem",
  },
  {
    src: "/images/messages/Frame 101645.svg",
    top: "33%",
    left: "50%",
    width: "108%",
    maxWidth: "20rem",
  },
  {
    src: "/images/messages/Frame 101646.svg",
    top: "35%",
    left: "47%",
    width: "98%",
    maxWidth: "17.5rem",
  },
];

export default function HeroSectionV2() {
  const [messageIndex, setMessageIndex] = useState(0);
  const storeHref = eatiAppStoreUrl("hero_download_cta");

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGE_FRAMES.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  const activeMessage = MESSAGE_FRAMES[messageIndex];

  return (
    <section className="px-4 sm:px-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative flex min-h-[min(680px,100svh)] flex-col overflow-hidden rounded-[2rem] md:min-h-[500px] md:flex-none md:rounded-[3rem] lg:min-h-[540px]"
          style={{
            background: "linear-gradient(180deg, #68AFFF 0%, #CFE3FF 100%)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/Frame 101563.svg"
              alt=""
              fill
              priority
              className="object-cover object-right"
              aria-hidden
            />
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-8 text-center md:min-h-[500px] md:items-start md:px-8 md:py-12 md:text-left lg:px-16 lg:py-16">
            <div className="mx-auto mb-4 md:mx-0 md:mb-5">
              <GreetingMascotIcon size={72} />
            </div>

            <h1 className="font-eati-heading text-3xl font-normal uppercase leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              I AM EATI!
              <br />
              YOUR ALL-IN-ONE
              <br />
              FITNESS COACH
            </h1>

            <div className="mt-6 flex flex-col items-center md:mt-8 md:items-start lg:mt-10">
              <a
                href={storeHref}
                data-eati-app-store="hero_download_cta"
                className="hero-download-cta group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full border border-white/15 bg-[#0A0B10] px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_rgba(10,11,16,0.32)] md:px-10 md:text-lg"
              >
                <svg
                  className="h-5 w-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 md:h-[1.35rem] md:w-[1.35rem]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Download Now</span>
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-2 flex w-full shrink-0 justify-center pb-0 pt-3 translate-y-3 sm:translate-y-2 md:mt-0 md:w-auto md:absolute md:right-10 md:top-5 md:translate-y-0 md:justify-end md:pb-0 md:pt-0 lg:right-16 lg:top-7 lg:-translate-y-1">
            <div className="relative w-[min(100%,240px)] sm:w-[15.25rem] md:w-[15.5rem] lg:w-[16.75rem]">
              <Image
                src={PHONE_SRC}
                alt="Eati app showing meal logging on iPhone"
                width={800}
                height={1600}
                priority
                className="relative z-10 h-auto w-full drop-shadow-lg"
              />

              <div
                className="pointer-events-none absolute z-20 -translate-x-1/2"
                style={{
                  top: activeMessage.top,
                  left: activeMessage.left,
                  width: activeMessage.width,
                  maxWidth: activeMessage.maxWidth,
                }}
              >
                <Image
                  key={activeMessage.src}
                  src={activeMessage.src}
                  alt=""
                  width={640}
                  height={820}
                  className="hero-phone-bubble-enter h-auto w-full object-contain"
                  aria-hidden
                  sizes="(max-width: 768px) 62vw, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
