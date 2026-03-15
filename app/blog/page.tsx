import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { getPublishedArticles } from '@/lib/blog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eati.app';

export const metadata = {
  title: 'Blog | Eati - AI Calorie Tracker',
  description:
    'Tips, guides, and insights on nutrition, calorie tracking, and healthy eating from the Eati team. Learn how to lose weight, count calories, and hit your macro goals.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Blog | Eati - Nutrition & Weight Loss Tips',
    description: 'Guides on calorie tracking, macros, and healthy eating.',
    url: `${siteUrl}/blog`,
  },
};

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
            className="mb-4 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: 'var(--font-bowlby-one), sans-serif', color: '#364052' }}
          >
            Blog
          </h1>
          <p
            className="mb-10 text-base md:text-lg"
            style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
          >
            Tips, guides, and insights on nutrition and healthy eating.
          </p>

          {articles.length === 0 ? (
            <p
              className="text-center text-gray-500"
              style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
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
                        alt={article.title}
                        fill
                        className="object-cover"
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
                      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                    >
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h2
                      className="mb-2 text-lg font-semibold group-hover:text-[#85BEFF]"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
                    >
                      {article.title}
                    </h2>
                    <p
                      className="line-clamp-3 flex-1 text-sm text-gray-600"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
                    >
                      {article.introduction}
                    </p>
                    <span
                      className="mt-4 text-sm font-medium text-[#85BEFF]"
                      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
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
