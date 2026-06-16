"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initSiteAnalytics, trackPageView } from "@/lib/site-analytics/client";

export default function SiteAnalyticsProvider() {
  const pathname = usePathname();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const run = () => {
      if (!initializedRef.current) {
        initSiteAnalytics();
        initializedRef.current = true;
      }
      trackPageView(pathname);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(run, 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
