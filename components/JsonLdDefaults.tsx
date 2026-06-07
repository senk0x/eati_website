import { SITE_URL, absoluteUrl } from "@/lib/seo";

const APP_STORE_URL =
  "https://apps.apple.com/app/apple-store/id6758241088?pt=127995771&ct=Official%20Website&mt=8";

/**
 * Site-wide JSON-LD: WebSite + SoftwareApplication (mobile app) + Organization.
 */
export default function JsonLdDefaults() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eati",
    url: SITE_URL,
    description:
      "AI calorie tracker and all-in-one fitness coach: log food by text, photo, barcode, or voice. Free TDEE, macro, and calorie calculators.",
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
    name: "Eati: AI Calorie Tracker & Fitness Coach",
    applicationCategory: "HealthApplication",
    applicationSubCategory: "NutritionApplication",
    operatingSystem: "iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "100",
    },
    description:
      "Track calories and macros in seconds with AI. Snap meals, scan barcodes, or describe food in plain language. Your all-in-one fitness coach for fat loss, maintenance, and muscle gain.",
    url: SITE_URL,
    downloadUrl: APP_STORE_URL,
    screenshot: absoluteUrl("/images/feature-chat.png"),
    author: { "@type": "Organization", name: "Eati", url: SITE_URL },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Eati",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/new_icon.png"),
      width: 512,
      height: 512,
    },
    description:
      "Eati builds AI-powered fitness and nutrition tools for iOS — calorie and macro tracking by text, photo, barcode, or voice.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
    },
    sameAs: [APP_STORE_URL],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </>
  );
}
