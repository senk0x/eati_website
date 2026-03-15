"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { sendPageView } from "@/lib/analytics";

/**
 * Sends a page_view to GA4 on every route change (client-side navigation).
 * Initial load is handled by gtag('config') in the layout; this ensures
 * subsequent navigations are tracked so each page gets correct traffic in GA.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    sendPageView(pathname);
  }, [pathname]);

  return null;
}
