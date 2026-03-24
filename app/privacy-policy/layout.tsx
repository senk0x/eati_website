import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Eati AI Calorie Tracker & Website",
  description:
    "Read how Eati collects, uses, and protects data for the AI calorie tracker app and this website. Transparency for nutrition logging, analytics, and your rights.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
