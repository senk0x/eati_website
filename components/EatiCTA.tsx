"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { sendEatiCtaClick, sendEatiCtaView } from "@/lib/analytics";
import { type EatiCtaContextType } from "@/lib/eati-cta-copy";
import { eatiAppStoreUrl } from "@/lib/seo";

const CTA_IMAGE_SRC = "/images/Frame%20101639.svg";

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
  productName = "",
  className = "",
  showSocialProof = false,
}: EatiCTAProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const viewSent = useRef(false);

  const buttonLabel = "Download Now";

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
      product_name: productName,
      show_social_proof: showSocialProof ? "1" : "0",
    }),
    [contextType, topic, variant, placementId, productName, showSocialProof]
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
      className={`overflow-hidden rounded-[24px] border border-[#D7E6FA] bg-[#8ABCF9] ${className}`}
      aria-label="Try Eati on iPhone"
    >
      <a
        href={storeHref}
        data-eati-app-store={`cta_${contextType}_${placementId ?? topic.slice(0, 20)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="group block"
        aria-label="Download Eati on the App Store"
      >
        <div className="relative aspect-[4331/2688] w-full">
          <Image
            src={CTA_IMAGE_SRC}
            alt="Get your free AI coach now. Download Eati."
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 960px"
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </div>
        <span className="sr-only">{buttonLabel}</span>
      </a>
    </aside>
  );
}
