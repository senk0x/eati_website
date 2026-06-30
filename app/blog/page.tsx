import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { getPublishedArticlesHybrid } from '@/lib/blog-blob';
import { getClusterLabel } from '@/lib/blog';
import { OG_BLOG_INDEX_ALT, OG_BLOG_INDEX_PATH } from '@/lib/og';
import { buildPageMetadata, normalizeImageAlt } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Nutrition Blog | AI Calorie Tracker Tips & Weight Loss Guides',
  description:
    'Calorie tracking, high-protein meals, macro splits, and fat loss guides from Eati — plus free TDEE, macro, and calorie calculators.',
  path: '/blog',
  ogImagePath: OG_BLOG_INDEX_PATH,
  ogImageAlt: OG_BLOG_INDEX_ALT,
  keywords: [
    'nutrition blog',
    'calorie tracking tips',
    'weight loss guides',
    'macro planning',
    'AI food log',
    'healthy eating',
  ],
});

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const articles = await getPublishedArticlesHybrid();
  const grouped = new Map<string, typeof articles>();
  for (const article of articles) {
    const key = article.topicCluster || 'weight-loss-guides';
    const current = grouped.get(key) || [];
    current.push(article);
    grouped.set(key, current);
  }
  const sortedClusters = Array.from(grouped.entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-5xl">
          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
          >
            Nutrition & Weight Loss Blog
          </h1>
          <p
            className="mb-10 text-base md:text-lg"
          >
            Practical guides on calorie tracking, macro splits, high-protein meals, and sustainable fat loss — with links to our free TDEE, calorie, and macro calculators.
          </p>
          {sortedClusters.length > 0 && (
            <nav className="mb-8 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-4 md:p-5" aria-label="Article topic clusters">
              <p className="mb-3 text-sm font-semibold text-eati-ink">Browse by topic</p>
              <div className="flex flex-wrap gap-2">
                {sortedClusters.map(([cluster, clusterArticles]) => (
                  <a
                    key={cluster}
                    href={`#cluster-${cluster}`}
                    className="rounded-full border border-[#D7E6FF] bg-white px-3 py-1.5 text-sm text-eati-ink transition-colors hover:border-[#88B8FF] hover:text-[#88B8FF]"
                  >
                    {getClusterLabel(cluster)} ({clusterArticles.length})
                  </a>
                ))}
              </div>
            </nav>
          )}

          {articles.length === 0 ? (
            <p
              className="text-center text-gray-500"
            >
              No articles published yet. Check back soon!
            </p>
          ) : (
            <div className="space-y-10">
              {sortedClusters.map(([cluster, clusterArticles]) => (
                <section key={cluster} id={`cluster-${cluster}`}>
                  <h2 className="mb-4 text-2xl font-bold text-eati-ink">
                    {getClusterLabel(cluster)}
                  </h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {clusterArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/blog/${article.slug}`}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3ECF7] bg-white transition-shadow hover:shadow-lg"
                      >
                        <div className="relative aspect-[16/9] w-full bg-[#E7F0FF]">
                          {article.coverImage ? (
                            <Image
                              src={article.coverImage}
                              alt={normalizeImageAlt(`${article.title} — Eati blog cover`)}
                              width={640}
                              height={360}
                              className="h-full w-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-5xl">
                              <span role="img" aria-label={`${getClusterLabel(cluster)} icon`}>
                                {article.emoji || '📝'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <time
                            dateTime={article.publishedAt}
                            className="mb-2 text-xs text-gray-500"
                          >
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                          <h3
                            className="mb-2 text-lg font-semibold group-hover:text-[#88B8FF]"
                          >
                            {article.title}
                          </h3>
                          <p
                            className="line-clamp-3 flex-1 text-sm text-gray-600"
                          >
                            {article.introduction}
                          </p>
                          <span
                            className="mt-4 text-sm font-medium text-[#88B8FF]"
                          >
                            Read more →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
