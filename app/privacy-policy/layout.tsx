import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Eati: AI Calorie Tracker app. How we collect, use, and protect your data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
