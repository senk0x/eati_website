import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-8 md:px-6 md:pb-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-2xl font-semibold md:mb-6 md:text-3xl">
            Contact us
          </h1>
          <p className="mb-8 text-sm md:text-base">
            Have questions about Eati or want to share feedback? Send us a message using the form below and we&apos;ll
            get back to you by email.
          </p>

          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
