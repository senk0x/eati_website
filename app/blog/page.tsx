import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { getPublishedArticles } from '@/lib/blog';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Nutrition Blog | AI Calorie Tracker Tips & Weight Loss Guides',
  description:
    'Practical guides on calorie tracking, high-protein meals, macro splits, and sustainable fat loss from Eati — plus links to free TDEE, macro, and calorie calculators.',
  path: '/blog',
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

export default function BlogPage() {
  const articles = getPublishedArticles();

  return (
    <div className="min-h-screen bg-white">
      {/* Spacer for fixed header */}
      <div className="pt-20 sm:pt-24 md:pt-28" />

      <main className="px-4 pb-12 md:px-6 md:pb-16">
        <div className="mx-auto max-w-5xl">
          <h1
            className="font-eati-heading mb-4 text-3xl font-bold md:text-4xl"
          >
            Blog
          </h1>
          <p
            className="mb-10 text-base md:text-lg"
          >
            Tips, guides, and insights on nutrition and healthy eating.
          </p>

          {articles.length === 0 ? (
            <p
              className="text-center text-gray-500"
            >
              No articles published yet. Check back soon!
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3ECF7] bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] w-full bg-[#E7F0FF]">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={`${article.title} — blog cover: nutrition, calories, and healthy eating tips`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl text-[#85BEFF]">
                        📝
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <time
                      className="mb-2 text-xs text-gray-500"
                    >
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h2
                      className="mb-2 text-lg font-semibold group-hover:text-[#85BEFF]"
                    >
                      {article.title}
                    </h2>
                    <p
                      className="line-clamp-3 flex-1 text-sm text-gray-600"
                    >
                      {article.introduction}
                    </p>
                    <span
                      className="mt-4 text-sm font-medium text-[#85BEFF]"
                    >
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
