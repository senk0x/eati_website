import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using the Eati: AI Calorie Tracker mobile application.",
  alternates: { canonical: "/terms-of-use" },
};

export default function TermsOfUseLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
