import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import {
  generateTableOfContents,
} from '@/lib/blog';
import {
  getArticleHybrid,
  getRelatedArticlesHybrid,
} from '@/lib/blog-blob';
import LinkedText from '@/components/LinkedText';
import ArticleContent from '@/components/ArticleContent';
import EatiCTA from '@/components/EatiCTA';
import RecipeMacroCalculator from '@/components/RecipeMacroCalculator';
import { blogTopicFromArticle } from '@/lib/eati-cta-copy';
import { SITE_URL, blogPostOgImagePath, buildPageMetadata, BRAND_OG_SHARE_IMAGE_PATH, absoluteUrl, normalizeImageAlt, normalizePageHeading } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

type ParsedRecipeMacros = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

function extractNumber(content: string, labelPattern: RegExp): number | null {
  const match = content.match(labelPattern);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function parseRecipeMacros(sectionContent: string): ParsedRecipeMacros | null {
  const calories = extractNumber(sectionContent, /calories?\s*:\s*(\d+(?:\.\d+)?)/i);
  const protein = extractNumber(sectionContent, /protein\s*:\s*(\d+(?:\.\d+)?)/i);
  const fat = extractNumber(sectionContent, /fat\s*:\s*(\d+(?:\.\d+)?)/i);
  const carbs = extractNumber(sectionContent, /(?:carbohydrates|carbs)\s*:\s*(\d+(?:\.\d+)?)/i);

  if (calories === null || protein === null || fat === null || carbs === null) {
    return null;
  }

  return { calories, protein, fat, carbs };
}

function parseRecipeBaseGramsFromIngredients(ingredientsContent: string): number | null {
  const gramMatches = ingredientsContent.match(/(\d+(?:\.\d+)?)\s*g\b/gi);
  if (!gramMatches || gramMatches.length === 0) return null;

  const total = gramMatches.reduce((sum, token) => {
    const value = Number(token.replace(/[^\d.]/g, ''));
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  return total > 0 ? total : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleHybrid(slug);

  if (!article || !article.published) {
    return { title: 'Article Not Found' };
  }

  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.introduction;
  const kw = article.targetKeyword ? [article.targetKeyword] : undefined;

  return buildPageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: 'article',
    keywords: kw,
    publishedTime: article.publishedAt,
    modifiedTime: article.publishedAt,
    ogImagePath: blogPostOgImagePath(slug),
    ogImageAlt: normalizeImageAlt(`${title} — Eati nutrition blog`),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleHybrid(slug);

  if (!article || !article.published) {
    notFound();
  }

  const toc = generateTableOfContents(article.sections);
  const relatedArticles = await getRelatedArticlesHybrid(slug, 3);
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const isRecipeArticle = slug.toLowerCase().includes('recipe');
  const ingredientsSection = article.sections.find((section) => /ingredients/i.test(section.heading));
  const recipeBaseGrams = ingredientsSection
    ? parseRecipeBaseGramsFromIngredients(ingredientsSection.content) ?? 100
    : 100;

  const imageUrl = article.coverImage
    ? (article.coverImage.startsWith('http') ? article.coverImage : `${SITE_URL}${article.coverImage}`)
    : absoluteUrl(BRAND_OG_SHARE_IMAGE_PATH);
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription || article.introduction,
    image: [imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'Eati', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Eati', url: SITE_URL },
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
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
            >
              <li>
                <Link href="/" className="hover:text-[#88B8FF]">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-[#88B8FF]">
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
              dateTime={article.publishedAt}
              className="mb-2 block text-sm text-gray-500"
            >
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h1
              className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
            >
              {normalizePageHeading(article.metaTitle || article.title)}
            </h1>
            <p
              className="text-lg text-gray-700"
            >
              <LinkedText text={article.introduction} />
            </p>
          </header>

          {/* Cover Image */}
          {(article.coverImage || article.emoji) && (
            <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#E7F0FF]">
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={normalizeImageAlt(`${article.title} — Eati blog cover`)}
                  width={1200}
                  height={675}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-7xl">
                  <span role="img" aria-label={`${article.title} topic icon`}>
                    {article.emoji}
                  </span>
                </div>
              )}
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
              >
                {normalizePageHeading(`In this ${article.title} guide`)}
              </h2>
              <ol className="space-y-2">
                {toc.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-eati-ink hover:text-[#88B8FF]"
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
          >
            {article.sections.map((section, index) => (
              (() => {
                const lines = section.content.split('\n');
                const photoLineIndex = lines.findIndex((l) => l.trim().toLowerCase().startsWith('photo:'));
                const parsedPhotoUrl =
                  photoLineIndex >= 0 ? lines[photoLineIndex].trim().slice('photo:'.length).trim() : null;

                const photoUrl = section.imageUrl?.trim() || parsedPhotoUrl;
                const isMacroSection = /calories\s*,\s*protein\s*,\s*fat\s*&\s*carbs/i.test(section.heading);
                const parsedRecipeMacros =
                  isRecipeArticle && isMacroSection ? parseRecipeMacros(section.content) : null;

                // Remove the `Photo:` line wherever it appears, so content renders cleanly.
                const contentWithoutPhoto =
                  photoLineIndex >= 0
                    ? [...lines.slice(0, photoLineIndex), ...lines.slice(photoLineIndex + 1)].join('\n')
                    : section.content;

                return (
                  <section key={index} id={`section-${index}`}>
                    <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                      <LinkedText text={section.heading} />
                    </h2>

                    {photoUrl && (
                      <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#E7F0FF]">
                        {/* Use plain <img> so externally hosted photos (including redirecting URLs) always display */}
                        <img
                          src={photoUrl}
                          alt={normalizeImageAlt(`${section.heading} — ${article.title}`)}
                          width={1200}
                          height={675}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <ArticleContent content={contentWithoutPhoto} />
                    {parsedRecipeMacros && (
                      <RecipeMacroCalculator
                        calories={parsedRecipeMacros.calories}
                        protein={parsedRecipeMacros.protein}
                        fat={parsedRecipeMacros.fat}
                        carbs={parsedRecipeMacros.carbs}
                        baseGrams={recipeBaseGrams}
                      />
                    )}
                  </section>
                );
              })()
            ))}

            <EatiCTA
              contextType="blog"
              topic={blogTopicFromArticle({
                targetKeyword: article.targetKeyword,
                title: article.title,
              })}
              placementId={`blog/${slug}`}
              className="mt-2"
            />

            {/* Conclusion */}
            <section>
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                {normalizePageHeading(`${article.title} summary`)}
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                <LinkedText text={article.conclusion} />
              </p>
            </section>

            {/* FAQ section (optional, for long-tail + FAQ schema) */}
            {article.faqs && article.faqs.length > 0 && (
              <section className="mt-10 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:p-8">
                <h2 className="mb-5 text-xl font-semibold md:text-2xl">
                  {normalizePageHeading(`${article.metaTitle || article.title} FAQ`)}
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group overflow-hidden rounded-xl border border-[#E3ECF7] bg-white transition-colors open:border-[#88B8FF]"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-eati-ink hover:bg-[#F7FAFF] [&::-webkit-details-marker]:hidden">
                        <span className="m-0 text-base font-semibold">{faq.question}</span>
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-[#88B8FF] transition-transform duration-200 group-open:rotate-180"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </summary>
                      <div className="border-t border-[#E3ECF7] px-5 py-4">
                        <p className="text-base leading-relaxed text-gray-700">
                          <LinkedText text={faq.answer} />
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Internal links: tools */}
            <section className="mt-10 border-t border-[#E3ECF7] pt-10">
              <h2 className="mb-3 text-xl font-semibold md:text-2xl">
                Free Tools to Reach Your Goals
              </h2>
              <p className="mb-4 text-base leading-relaxed text-gray-700">
                Use our{' '}
                <Link href="/tools/calorie-burn-calculator" className="text-[#88B8FF] hover:underline">
                  calorie burn calculator
                </Link>
                ,{' '}
                <Link href="/tools/calorie-calculator" className="text-[#88B8FF] hover:underline">
                  calorie calculator
                </Link>
                ,{' '}
                <Link href="/tools/tdee-calculator" className="text-[#88B8FF] hover:underline">
                  TDEE calculator
                </Link>
                , and{' '}
                <Link href="/tools/macro-goal-calculator" className="text-[#88B8FF] hover:underline">
                  macro calculator
                </Link>{' '}
                to set your daily targets. Explore all{' '}
                <Link href="/tools" className="text-[#88B8FF] hover:underline">
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
              className="font-eati-heading mb-6 text-2xl font-bold"
            >
              {normalizePageHeading(`More articles like ${article.title}`)}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3ECF7] bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#E7F0FF]">
                    {related.coverImage ? (
                      <img
                        src={related.coverImage}
                        alt={normalizeImageAlt(`${related.title} — Eati blog`)}
                        width={640}
                        height={360}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">
                        <span role="img" aria-label={`${related.title} topic icon`}>
                          {related.emoji || '📝'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="relative z-10 shrink-0 bg-white p-4">
                    <h3 className="text-base font-semibold text-eati-ink group-hover:text-[#88B8FF]">
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
