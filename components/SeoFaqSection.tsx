/**
 * FAQ section + FAQPage schema for SEO (long-tail keywords, rich results).
 * Use on tool pages and blog articles.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

interface SeoFaqSectionProps {
  faqs: FaqItem[];
  title?: string;
  className?: string;
}

export function SeoFaqSection({ faqs, title = 'Frequently Asked Questions', className = '' }: SeoFaqSectionProps) {
  if (!faqs.length) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <section className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="mb-4 text-xl font-semibold md:text-2xl">
        {title}
      </h2>
      <ul className="space-y-6">
        {faqs.map((faq, i) => (
          <li key={i}>
            <h3 className="mb-2 text-base font-semibold text-[#364052]">{faq.question}</h3>
            <p className="text-base leading-relaxed text-gray-700">{faq.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
