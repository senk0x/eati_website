import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
  generateTableOfContents,
} from '@/lib/blog';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eatiapp.com';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || !article.published) {
    return { title: 'Article Not Found' };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.introduction;

  return {
    title,
    description,
    keywords: article.targetKeyword,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      url: `${siteUrl}/blog/${slug}`,
      images: article.coverImage ? [article.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const articles = getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const toc = generateTableOfContents(article.sections);
  const relatedArticles = getRelatedArticles(slug, 3);
  const canonicalUrl = `${siteUrl}/blog/${slug}`;

  const imageUrl = article.coverImage
    ? (article.coverImage.startsWith('http') ? article.coverImage : `${siteUrl}${article.coverImage}`)
    : undefined;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription || article.introduction,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Eati', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Eati', url: siteUrl },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  const faqSchema =
    article.faqs && article.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <article className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol
              className="flex items-center gap-2 text-sm"
              style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
            >
              <li>
                <Link href="/" className="hover:text-[#85BEFF]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-[#85BEFF]">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-500">{article.title}</li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <time
              className="mb-2 block text-sm text-gray-500"
              style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
            >
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h1
              className="mb-4 text-3xl font-bold md:text-4xl"
              style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
            >
              {article.title}
            </h1>
            <p
              className="text-lg text-gray-700"
              style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
            >
              {article.introduction}
            </p>
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#E7F0FF]">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Table of Contents */}
          {toc.length > 0 && (
            <nav
              className="mb-8 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5"
              aria-label="Table of contents"
            >
              <h2
                className="mb-3 text-base font-semibold"
                style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
              >
                Table of Contents
              </h2>
              <ol className="space-y-2">
                {toc.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-[#364052] hover:text-[#85BEFF]"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                    >
                      {index + 1}. {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Article Sections */}
          <div
            className="space-y-8"
            style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
          >
            {article.sections.map((section, index) => (
              <section key={index} id={`section-${index}`}>
                <h2 className="mb-3 text-xl font-semibold md:text-2xl">{section.heading}</h2>
                <p
                  className="text-base leading-relaxed text-gray-700"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {section.content}
                </p>
              </section>
            ))}

            {/* Mid-Article CTA */}
            {article.midArticleCta && (
              <div className="rounded-2xl bg-[#85BEFF] p-6 text-center text-white">
                <p
                  className="mb-4 text-lg font-medium"
                  style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                >
                  {article.midArticleCta}
                </p>
                <a
                  href="https://apps.apple.com/app/apple-store/id6758241088?pt=127995771&ct=Official%20Website&mt=8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#364052] transition-colors hover:bg-gray-100"
                  style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Download Eati
                </a>
              </div>
            )}

            {/* Conclusion */}
            <section>
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">Conclusion</h2>
              <p className="text-base leading-relaxed text-gray-700">{article.conclusion}</p>
            </section>

            {/* FAQ section (optional, for long-tail + FAQ schema) */}
            {article.faqs && article.faqs.length > 0 && (
              <section className="mt-10 border-t border-[#E3ECF7] pt-10">
                <h2 className="mb-4 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                  Frequently Asked Questions
                </h2>
                <ul className="space-y-6">
                  {article.faqs.map((faq, i) => (
                    <li key={i}>
                      <h3 className="mb-2 text-base font-semibold text-[#364052]">{faq.question}</h3>
                      <p className="text-base leading-relaxed text-gray-700">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Internal links: tools */}
            <section className="mt-10 border-t border-[#E3ECF7] pt-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
                Free Tools to Reach Your Goals
              </h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700">
                Use our{' '}
                <Link href="/tools/calorie-calculator" className="text-[#85BEFF] hover:underline">
                  calorie calculator
                </Link>
                ,{' '}
                <Link href="/tools/tdee-calculator" className="text-[#85BEFF] hover:underline">
                  TDEE calculator
                </Link>
                , and{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#85BEFF] hover:underline">
                  macro calculator
                </Link>{' '}
                to set your daily targets. Explore all{' '}
                <Link href="/tools" className="text-[#85BEFF] hover:underline">
                  fitness & weight loss tools
                </Link>.
              </p>
            </section>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <aside className="mx-auto mt-16 max-w-5xl">
            <h2
              className="mb-6 text-2xl font-bold"
              style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
            >
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3ECF7] bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full bg-[#E7F0FF]">
                    {related.coverImage ? (
                      <Image
                        src={related.coverImage}
                        alt={related.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl text-[#85BEFF]">
                        📝
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-base font-semibold group-hover:text-[#85BEFF]"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
                    >
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>

      <Footer />
    </div>
  );
}
