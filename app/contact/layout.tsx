import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Eati | AI Calorie Tracker & Nutrition Tools",
  description:
    "Contact Eati for app support, press, partnerships, or calculator feedback. Questions about the AI calorie tracker, macros, and weight loss.",
  path: "/contact",
  keywords: ["contact Eati", "AI calorie tracker support", "nutrition app help"],
});

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
