import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ReferralProgramForm from '@/components/ReferralProgramForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Eati Referral Program | Join as Influencer Partner',
  description:
    'Join the Eati referral program. Apply as an influencer, share your promo code, and track activations and purchases.',
  path: '/referral-program',
});

export default function ReferralProgramPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-8 md:px-6 md:pb-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Get Started with Eati</h1>
          <p className="mb-6 text-sm text-gray-600 md:text-base">
            Join our referral program and become an Eati partner. Share your audience profiles below and we&apos;ll
            reach out to set everything up.
          </p>

          <section className="mb-8 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5 md:p-6">
            <h2 className="mb-3 text-lg font-semibold text-eati-ink">How the referral program works</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600 md:text-base">
              <li>Apply with your social profiles and audience details.</li>
              <li>Receive a unique promo code once approved.</li>
              <li>Share Eati with your audience and track activations in your dashboard.</li>
              <li>Earn rewards when referred users subscribe to Eati.</li>
            </ol>
          </section>

          <ReferralProgramForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
