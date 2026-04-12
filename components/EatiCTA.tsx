"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendEatiCtaClick, sendEatiCtaView } from "@/lib/analytics";
import {
  type EatiCtaContextType,
  resolveEatiCtaCopy,
} from "@/lib/eati-cta-copy";
import { eatiAppStoreUrl } from "@/lib/seo";

const ROTATE_MS_MIN = 3000;
const ROTATE_MS_MAX = 5000;

function hashImageStart(parts: string[]): number {
  const s = parts.join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h % 3;
}

export interface EatiCTAProps {
  contextType: EatiCtaContextType;
  topic: string;
  variant?: string;
  /** Stable id for analytics and App Store campaign tag, e.g. blog slug or tool id */
  placementId?: string;
  productName?: string;
  className?: string;
  showSocialProof?: boolean;
}

export default function EatiCTA({
  contextType,
  topic,
  variant,
  placementId,
  productName,
  className = "",
  showSocialProof = true,
}: EatiCTAProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const viewSent = useRef(false);

  const copy = useMemo(
    () => resolveEatiCtaCopy({ contextType, topic, variant, productName }),
    [contextType, topic, variant, productName]
  );

  const initialImageIndex = useMemo(
    () => hashImageStart([contextType, topic, variant ?? "", placementId ?? ""]),
    [contextType, topic, variant, placementId]
  );

  const [imageIndex, setImageIndex] = useState(initialImageIndex);

  useEffect(() => {
    const schedule = () =>
      ROTATE_MS_MIN +
      Math.floor(Math.random() * (ROTATE_MS_MAX - ROTATE_MS_MIN + 1));
    let timeoutId: ReturnType<typeof setTimeout>;

    const bump = () => {
      setImageIndex((i) => (i + 1) % copy.imagePaths.length);
      timeoutId = setTimeout(bump, schedule());
    };

    timeoutId = setTimeout(bump, schedule());
    return () => clearTimeout(timeoutId);
  }, [copy.imagePaths.length]);

  const buttonLabel = copy.buttonLabel;

  const storeHref = useMemo(() => {
    const tag = [
      "cta",
      contextType,
      placementId?.replace(/\//g, "_") || topic.slice(0, 40),
    ]
      .filter(Boolean)
      .join("_");
    return eatiAppStoreUrl(tag);
  }, [contextType, placementId, topic]);

  const analyticsBase = useMemo(
    () => ({
      context_type: contextType,
      topic: topic.slice(0, 120),
      variant: variant ?? "",
      placement_id: placementId ?? "",
    }),
    [contextType, topic, variant, placementId]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el || viewSent.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some(
          (e) => e.isIntersecting && e.intersectionRatio >= 0.35
        );
        if (hit && !viewSent.current) {
          viewSent.current = true;
          sendEatiCtaView(analyticsBase);
        }
      },
      { threshold: [0, 0.35, 0.5, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [analyticsBase]);

  const onClick = useCallback(() => {
    sendEatiCtaClick({ ...analyticsBase, button_label: buttonLabel });
  }, [analyticsBase, buttonLabel]);

  return (
    <aside
      ref={rootRef}
      className={`rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5 md:p-6 ${className}`}
      aria-label="Try Eati on iPhone"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-stretch md:gap-6">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[220px] shrink-0 md:mx-0 md:w-[200px]">
          {copy.imagePaths.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="220px"
              className={`object-contain transition-opacity duration-700 ease-in-out ${
                i === imageIndex ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden
            />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-eati-heading text-lg font-semibold leading-snug text-[#364052] md:text-xl">
            {copy.headline}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
            {copy.subtext}
          </p>
          {copy.subtextAddon ? (
            <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-base">
              {copy.subtextAddon}
            </p>
          ) : null}
          <p className="mt-3 text-sm font-medium text-[#364052]">
            <span className="text-[#85BEFF]">●</span> {copy.featureHighlight}
          </p>
          {showSocialProof && (
            <p className="mt-2 text-xs text-gray-500 md:text-sm">
              {copy.socialProof}
            </p>
          )}
          <a
            href={storeHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#364052] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2b3545] md:px-6"
          >
            <svg
              className="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span>{buttonLabel}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
