import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use | Eati Mobile App & Services",
  description:
    "Terms and conditions for the Eati AI calorie tracker app and related services. License, acceptable use, disclaimers, and limitations — read before you download.",
  path: "/terms-of-use",
});

export default function TermsOfUseLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
