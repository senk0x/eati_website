import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import ReferralDashboard from '@/components/ReferralDashboard';
import { buildPageMetadata } from '@/lib/seo';

const pageMetadata = buildPageMetadata({
  title: 'Eati Referral Dashboard | Track Promo Code Stats',
  description: 'Track your Eati promo code activations and subscription payments.',
  path: '/referral-program/dashboard',
});

export const metadata: Metadata = {
  ...pageMetadata,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReferralDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-8 md:px-6 md:pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold md:text-3xl">Referral Dashboard</h1>
            <Link href="/referral-program" className="text-sm text-gray-500 hover:text-[#88B8FF]">
              Back
            </Link>
          </div>

          <ReferralDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
