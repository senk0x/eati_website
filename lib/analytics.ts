/**
 * Google Analytics 4 measurement ID. Used in root layout (script) and GoogleAnalytics client component (page_view on route change).
 */
export const GA_MEASUREMENT_ID = "G-F5M8XD3SFX";

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function sendPageView(path: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}
