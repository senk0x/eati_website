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
          <p className="mb-6 text-sm md:text-base">
            Have questions about Eati or want to share feedback? Send us a message using the form
            below and we&apos;ll get back to you by email.
          </p>

          <section className="mb-8 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5 md:p-6">
            <h2 className="mb-3 text-lg font-semibold text-eati-ink">What you can contact us about</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600 md:text-base">
              <li>App support, bug reports, and feature requests for the Eati calorie tracker.</li>
              <li>Questions about free nutrition calculators on eatiapp.com.</li>
              <li>Press, partnerships, and referral program inquiries.</li>
            </ul>
          </section>

          <section aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="mb-4 text-lg font-semibold text-eati-ink">
              Send us a message
            </h2>
            <ContactForm />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
