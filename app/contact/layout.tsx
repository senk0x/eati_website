import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Eati team. Questions about the AI calorie tracker app, nutrition tools, or partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
