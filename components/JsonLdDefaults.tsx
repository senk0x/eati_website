import { SITE_URL, absoluteUrl } from "@/lib/seo";

const APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6758241088?pt=127995771&ct=Official%20Website&mt=8";

/**
 * Site-wide JSON-LD: WebSite + SoftwareApplication (mobile app).
 */
export default function JsonLdDefaults() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eati",
    url: SITE_URL,
    description:
      "AI calorie tracker and meal planner: log food by text, photo, barcode, or voice. Free TDEE, macro, and calorie calculators.",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Eati",
      url: SITE_URL,
    },
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Eati: AI Calorie Tracker",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Track calories and macros in seconds with AI. Snap meals, scan barcodes, or describe food in plain language. Built for fat loss, maintenance, and muscle gain.",
    url: SITE_URL,
    downloadUrl: APP_STORE_URL,
    screenshot: absoluteUrl("/images/feature-chat.png"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }}
      />
    </>
  );
}
